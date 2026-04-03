import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';

// Fallback: called from the success page to ensure the subscription
// row is written even if the webhook hasn't fired yet.

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    console.log('[verify-session] called with sessionId:', sessionId);

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('[verify-session] session mode:', session.mode, 'payment_status:', session.payment_status);
    console.log('[verify-session] metadata:', JSON.stringify(session.metadata));

    if (session.mode !== 'subscription' || session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Session is not a paid subscription' }, { status: 400 });
    }

    const userId = session.metadata?.supabase_user_id;
    const planName = session.metadata?.plan_name ?? 'Unknown';
    const stripeSubId = session.subscription as string;

    console.log('[verify-session] userId:', userId, 'stripeSubId:', stripeSubId);

    if (!userId || !stripeSubId) {
      return NextResponse.json({ error: 'Missing metadata in session' }, { status: 400 });
    }

    // Check if subscription row already exists and is active
    const { data: existing } = await supabaseAdmin
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (existing) {
      console.log('[verify-session] already active, skipping');
      return NextResponse.json({ status: 'already_active' });
    }

    // Retrieve subscription details from Stripe
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sub = await stripe.subscriptions.retrieve(stripeSubId) as any;
    const priceAmount = sub.items?.data?.[0]?.price?.unit_amount
      ? sub.items.data[0].price.unit_amount / 100
      : 0;
    const periodEnd = sub.current_period_end as number | undefined;
    const startDate = sub.start_date as number | undefined;

    const expiresAt = periodEnd ? new Date(periodEnd * 1000).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const startedAt = startDate ? new Date(startDate * 1000).toISOString() : new Date().toISOString();

    console.log('[verify-session] priceAmount:', priceAmount, 'expiresAt:', expiresAt);

    // Check if ANY row exists for this user
    const { data: anyRow } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (anyRow) {
      console.log('[verify-session] updating existing row:', anyRow.id);
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({
          plan_name: planName,
          status: 'active',
          price_sar: priceAmount,
          stripe_subscription_id: stripeSubId,
          started_at: startedAt,
          expires_at: expiresAt,
          cancel_at_period_end: false,
          cancelled_at: null,
        })
        .eq('id', anyRow.id);

      if (error) {
        console.error('[verify-session] update error:', JSON.stringify(error));
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      console.log('[verify-session] inserting new row');
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_name: planName,
          status: 'active',
          price_sar: priceAmount,
          stripe_subscription_id: stripeSubId,
          started_at: startedAt,
          expires_at: expiresAt,
        });

      if (error) {
        console.error('[verify-session] insert error:', JSON.stringify(error));
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    console.log('[verify-session] SUCCESS — subscription activated for user:', userId);
    return NextResponse.json({ status: 'activated' });
  } catch (err) {
    console.error('[verify-session] error:', err);
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}
