import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// POST — create Stripe product + monthly recurring price
// Returns { price_id, product_id }
export async function POST(req: NextRequest) {
  try {
    const { name, price_sar, description } = await req.json();

    if (!name || !price_sar) {
      return NextResponse.json({ error: 'name and price_sar are required' }, { status: 400 });
    }

    const product = await stripe.products.create({
      name,
      description: description || undefined,
    });

    // Stripe uses smallest currency unit — AED has 2 decimal places
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(Number(price_sar) * 100),
      currency: 'aed',
      recurring: { interval: 'month' },
    });

    return NextResponse.json({ price_id: price.id, product_id: product.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — archive a Stripe price (and its parent product)
// Body: { stripe_price_id }
export async function DELETE(req: NextRequest) {
  try {
    const { stripe_price_id } = await req.json();
    if (!stripe_price_id) return NextResponse.json({ success: true });

    const price = await stripe.prices.retrieve(stripe_price_id);
    await stripe.prices.update(stripe_price_id, { active: false });

    if (price.product && typeof price.product === 'string') {
      await stripe.products.update(price.product, { active: false });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Stripe archive error:', message);
    // Return success anyway — don't block DB delete on Stripe failure
    return NextResponse.json({ success: true, warning: message });
  }
}
