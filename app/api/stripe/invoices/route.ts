import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json() as { userId: string };

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get stripe_subscription_id from our DB
    const { data: sub } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .not('stripe_subscription_id', 'is', null)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub?.stripe_subscription_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    // Get the customer from the subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id) as any;
    const customerId = typeof stripeSub.customer === 'string'
      ? stripeSub.customer
      : stripeSub.customer?.id;

    if (!customerId) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    // Fetch invoices for this customer
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 12,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatted = invoices.data.map((inv: any) => ({
      id: inv.id,
      number: inv.number,
      status: inv.status,
      amount: inv.amount_paid ? inv.amount_paid / 100 : 0,
      currency: inv.currency?.toUpperCase() ?? 'SAR',
      date: inv.created ? new Date(inv.created * 1000).toISOString() : null,
      pdf: inv.invoice_pdf ?? null,
      hosted_url: inv.hosted_invoice_url ?? null,
    }));

    return NextResponse.json({ invoices: formatted });
  } catch (err) {
    console.error('[invoices] error:', err);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}
