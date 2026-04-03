import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, phone } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'email, password, and full_name are required' }, { status: 400 });
    }

    const supabaseAdmin = createServerClient();

    // Create the auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // auto-confirm email
      user_metadata: { full_name, phone: phone ?? '' },
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message ?? 'Failed to create user' }, { status: 400 });
    }

    // Upsert profile with coach role
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: authData.user.id,
      email,
      full_name,
      phone: phone ?? null,
      role: 'coach',
      onboarding_completed: true,
    });

    if (profileError) {
      // Clean up the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, userId: authData.user.id });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
