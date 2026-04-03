import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Map Stripe's subscription statuses to our enum values
// Enum: 'active' | 'cancelled' | 'expired' | 'pending'
function toDbStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case 'active':   return 'active';
    case 'canceled': return 'cancelled';
    case 'past_due':
    case 'unpaid':
    case 'trialing':
    case 'incomplete':
    case 'incomplete_expired':
    default:         return 'pending';
  }
}

// Helper: extract subscription fields safely across Stripe SDK versions
function getSubFields(sub: Record<string, unknown>) {
  return {
    periodEnd: sub.current_period_end as number | undefined,
    startDate: sub.start_date as number | undefined,
    status: sub.status as string,
    cancelAtPeriodEnd: sub.cancel_at_period_end as boolean,
    priceAmount: (() => {
      const items = sub.items as { data?: { price?: { unit_amount?: number } }[] } | undefined;
      const amt = items?.data?.[0]?.price?.unit_amount;
      return amt ? amt / 100 : 0;
    })(),
  };
}

export async function POST(req: NextRequest) {
  console.log('========== [WEBHOOK] HIT ==========');

  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');

  console.log('[webhook] sig present:', !!sig);
  console.log('[webhook] body length:', rawBody.length);
  console.log('[webhook] STRIPE_WEBHOOK_SECRET present:', !!process.env.STRIPE_WEBHOOK_SECRET);

  if (!sig) {
    console.error('[webhook] NO stripe-signature header');
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log('[webhook] signature VERIFIED, event type:', event.type);
  } catch (err) {
    console.error('[webhook] signature verification FAILED:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {

      // ── New subscription created via Checkout ──────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[webhook] checkout session mode:', session.mode);
        console.log('[webhook] session metadata:', JSON.stringify(session.metadata));
        console.log('[webhook] session.subscription:', session.subscription);

        if (session.mode !== 'subscription') {
          console.log('[webhook] not subscription mode, skipping');
          break;
        }

        const userId = session.metadata?.supabase_user_id;
        const planName = session.metadata?.plan_name ?? 'Unknown';
        const stripeSubId = session.subscription as string;

        console.log('[webhook] userId:', userId);
        console.log('[webhook] planName:', planName);
        console.log('[webhook] stripeSubId:', stripeSubId);

        if (!userId || !stripeSubId) {
          console.error('[webhook] MISSING userId or stripeSubId in session metadata');
          break;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = await stripe.subscriptions.retrieve(stripeSubId) as any;
        const { periodEnd, startDate, priceAmount } = getSubFields(sub);
        console.log('[webhook] retrieved stripe sub — status:', sub.status, 'periodEnd:', periodEnd, 'priceAmount:', priceAmount);

        const expiresAt = periodEnd ? new Date(periodEnd * 1000).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const startedAt = startDate ? new Date(startDate * 1000).toISOString() : new Date().toISOString();

        // Check if a subscription row already exists for this user
        const { data: existing, error: lookupError } = await supabaseAdmin
          .from('subscriptions')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        console.log('[webhook] existing lookup:', JSON.stringify({ existing, lookupError }));

        let dbError;
        if (existing) {
          console.log('[webhook] UPDATING existing row:', existing.id);
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
            .eq('id', existing.id);
          dbError = error;
        } else {
          console.log('[webhook] INSERTING new subscription row');
          const insertData = {
            user_id: userId,
            plan_name: planName,
            status: 'active',
            price_sar: priceAmount,
            stripe_subscription_id: stripeSubId,
            started_at: startedAt,
            expires_at: expiresAt,
          };
          console.log('[webhook] insert data:', JSON.stringify(insertData));
          const { error, data } = await supabaseAdmin
            .from('subscriptions')
            .insert(insertData)
            .select();
          console.log('[webhook] insert result:', JSON.stringify({ data, error }));
          dbError = error;
        }

        if (dbError) {
          console.error('[webhook] DB WRITE ERROR:', JSON.stringify(dbError));
          throw new Error(dbError.message);
        }

        console.log(`[webhook] SUCCESS — subscription activated for user ${userId}`);
        break;
      }

      // ── Subscription renewed or updated ───────────────────
      case 'customer.subscription.updated': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = event.data.object as any;
        const { periodEnd, status } = getSubFields(sub);
        console.log('[webhook] subscription.updated for:', sub.id, 'status:', status);

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: toDbStatus(status),
            ...(periodEnd && { expires_at: new Date(periodEnd * 1000).toISOString() }),
          })
          .eq('stripe_subscription_id', sub.id);

        if (error) console.error('[webhook] subscription.updated error:', error.message);
        else console.log('[webhook] subscription.updated SUCCESS');
        break;
      }

      // ── Subscription cancelled ─────────────────────────────
      case 'customer.subscription.deleted': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = event.data.object as any;
        console.log('[webhook] subscription.deleted for:', sub.id);

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', sub.id);

        if (error) console.error('[webhook] subscription.deleted error:', error.message);
        break;
      }

      // ── Payment failed ─────────────────────────────────────
      case 'invoice.payment_failed': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const stripeSubId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;
        if (!stripeSubId) break;

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'pending' })
          .eq('stripe_subscription_id', stripeSubId);

        if (error) console.error('[webhook] payment_failed error:', error.message);
        break;
      }

      // ── Invoice paid (renewal) ─────────────────────────────
      case 'invoice.paid': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const stripeSubId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;
        if (!stripeSubId) break;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = await stripe.subscriptions.retrieve(stripeSubId) as any;
        const { periodEnd } = getSubFields(sub);

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            ...(periodEnd && { expires_at: new Date(periodEnd * 1000).toISOString() }),
          })
          .eq('stripe_subscription_id', stripeSubId);

        if (error) console.error('[webhook] invoice.paid error:', error.message);
        break;
      }

      default:
        console.log('[webhook] unhandled event type:', event.type);
        break;
    }
  } catch (err) {
    console.error(`[webhook] HANDLER ERROR for ${event.type}:`, err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
