import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      walletAddress,
      username,
      isAuthenticated,
      miniKitUser,
      message,
      hasWallet,
      hasUsername
    } = body;

    // If this is a session check attempt message
    if (message) {
      console.log(`🔄 [SESSION CHECK] ${message}`, {
        hasWallet,
        hasUsername,
        username: miniKitUser?.username,
        walletAddress: miniKitUser?.walletAddress
      });
      return NextResponse.json({ success: true });
    }

    console.log('🔍 [DEBUG SESSION] ==================');
    console.log('🔍 [DEBUG SESSION] Frontend state:', {
      isAuthenticated,
      walletAddress,
      username,
      miniKitUser
    });

    if (walletAddress) {
      const { data: dbUser, error } = await supabaseAdmin
        .from('users')
        .select('wallet_address, username, onboarding_completed, notifications_enabled')
        .eq('wallet_address', walletAddress)
        .maybeSingle();

      if (error) {
        console.log('❌ [DEBUG SESSION] DB Error:', error);
      } else if (dbUser) {
        console.log('📊 [DEBUG SESSION] DB Data:', dbUser);
      } else {
        console.log('❌ [DEBUG SESSION] User not found in DB');
      }
    }

    console.log('🔍 [DEBUG SESSION] ==================\n');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ [DEBUG SESSION] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
