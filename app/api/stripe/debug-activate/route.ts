import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// DEBUG ONLY — remove before production
// This endpoint manually activates a subscription for a user
// to test that the dashboard subscription check works.

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  console.log('[debug-activate] Attempting to insert subscription for user:', userId);

  // First check what's already in the table for this user
  const { data: existing, error: lookupErr } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId);

  console.log('[debug-activate] Existing rows:', JSON.stringify(existing));
  console.log('[debug-activate] Lookup error:', JSON.stringify(lookupErr));

  // Try inserting
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_name: 'Full Coaching',
      status: 'active',
      price_sar: 349,
      started_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select();

  console.log('[debug-activate] Insert result:', JSON.stringify({ data, error }));

  if (error) {
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
