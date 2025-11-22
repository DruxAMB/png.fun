import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { miniKitUser } = body;

    console.log('🔍 [CHECK SESSION] Checking session with MiniKit user...');

    // If MiniKit has wallet address, check if user exists in DB
    if (miniKitUser?.walletAddress) {
      console.log('📊 [CHECK SESSION] MiniKit has wallet:', miniKitUser.walletAddress);

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select(
          'wallet_address, username, profile_picture_url, onboarding_completed, notifications_enabled'
        )
        .eq('wallet_address', miniKitUser.walletAddress)
        .maybeSingle();

      if (error || !user) {
        console.log('❌ [CHECK SESSION] User not found in DB');
        return NextResponse.json({ user: null, hasSession: false });
      }

      console.log('✅ [CHECK SESSION] User found:', {
        username: user.username,
        onboarding_completed: user.onboarding_completed,
        notifications_enabled: user.notifications_enabled
      });

      return NextResponse.json({ user, hasSession: true });
    }

    // If MiniKit has username but no wallet, try username lookup
    if (miniKitUser?.username) {
      console.log('📊 [CHECK SESSION] MiniKit has username (no wallet):', miniKitUser.username);

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select(
          'wallet_address, username, profile_picture_url, onboarding_completed, notifications_enabled'
        )
        .eq('username', miniKitUser.username)
        .maybeSingle();

      if (error || !user) {
        console.log('❌ [CHECK SESSION] User not found by username');
        return NextResponse.json({ user: null, hasSession: false });
      }

      console.log('✅ [CHECK SESSION] User found by username:', {
        username: user.username,
        onboarding_completed: user.onboarding_completed,
        notifications_enabled: user.notifications_enabled
      });

      return NextResponse.json({ user, hasSession: true });
    }

    console.log('❌ [CHECK SESSION] No MiniKit user data');
    return NextResponse.json({ user: null, hasSession: false });
  } catch (error: any) {
    console.error('❌ [CHECK SESSION] Error:', error);
    return NextResponse.json({ user: null, hasSession: false });
  }
}
