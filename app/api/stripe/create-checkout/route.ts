import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { planId, userId, userEmail } = await req.json() as {
      planId: string;
      userId: string;
      userEmail: string;
    };

    if (!planId || !userId || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Look up the plan from the DB
    const { data: plan, error: planError } = await supabaseAdmin
      .from('pricing_plans')
      .select('id, name, price_sar, stripe_price_id, is_published')
      .eq('id', planId)
      .maybeSingle();

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    if (!plan.is_published) {
      return NextResponse.json({ error: 'This plan is not available' }, { status: 400 });
    }

    if (!plan.stripe_price_id) {
      return NextResponse.json(
        { error: 'This plan is not configured for checkout yet. Please contact support.' },
        { status: 503 }
      );
    }

    // Create Stripe customer for this checkout
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: { supabase_user_id: userId },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?cancelled=true`,
      metadata: {
        supabase_user_id: userId,
        plan_id: plan.id,
        plan_name: plan.name,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
          plan_id: plan.id,
          plan_name: plan.name,
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout] error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
