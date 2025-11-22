import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 [WORLDAPP USER CHECK] Checking for current user session...');

    // Try to get user from session cookie first
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');

    if (sessionCookie?.value) {
      console.log('📊 [WORLDAPP USER CHECK] Found session cookie:', sessionCookie.value);

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select(
          'wallet_address, username, profile_picture_url, onboarding_completed, notifications_enabled'
        )
        .eq('wallet_address', sessionCookie.value)
        .maybeSingle();

      if (!error && user && user.onboarding_completed) {
        console.log('✅ [WORLDAPP USER CHECK] Current user found with completed onboarding');
        return NextResponse.json({ hasUser: true, user });
      }
    }

    console.log('❌ [WORLDAPP USER CHECK] No valid session found');
    return NextResponse.json({ hasUser: false });
  } catch (error: any) {
    console.error('❌ [WORLDAPP USER CHECK] Error:', error);
    return NextResponse.json({ hasUser: false });
  }
}
