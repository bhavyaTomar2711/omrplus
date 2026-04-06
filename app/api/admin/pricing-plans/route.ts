import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';

// Uses service role key — bypasses RLS. Admin-only operations.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — all plans (not just published), for admin panel
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('pricing_plans')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ plans: data ?? [] });
}

// POST — create new plan
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from('pricing_plans')
      .insert(body)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ plan: data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PUT — update existing plan
export async function PUT(req: NextRequest) {
  try {
    const { id, ...body } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('pricing_plans')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ plan: data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE — archive on Stripe then remove from DB
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    // Fetch the plan to get its Stripe price ID
    const { data: plan } = await supabaseAdmin
      .from('pricing_plans')
      .select('stripe_price_id')
      .eq('id', id)
      .single();

    // Archive on Stripe if a price ID exists
    if (plan?.stripe_price_id) {
      try {
        const price = await stripe.prices.retrieve(plan.stripe_price_id);
        await stripe.prices.update(plan.stripe_price_id, { active: false });
        if (price.product && typeof price.product === 'string') {
          await stripe.products.update(price.product, { active: false });
        }
      } catch (stripeErr) {
        // Log but don't block — DB delete still proceeds
        console.error('Stripe archive failed:', stripeErr);
      }
    }

    const { error } = await supabaseAdmin
      .from('pricing_plans')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
