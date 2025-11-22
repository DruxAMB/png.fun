import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    console.log('🔍 [API BY-USERNAME] ==================');
    console.log('🔍 [API BY-USERNAME] Request received for username:', username);

    if (!username) {
      console.log('❌ [API BY-USERNAME] No username provided');
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    // Query database for user with this username
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select(
        'id, wallet_address, username, profile_picture_url, onboarding_completed, notifications_enabled'
      )
      .eq('username', username)
      .maybeSingle(); // Use maybeSingle instead of single to avoid error if no user found

    if (error) {
      console.error('❌ [API BY-USERNAME] Database error:', error);
      console.log('🔍 [API BY-USERNAME] ==================\n');
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!user) {
      console.log('❌ [API BY-USERNAME] User not found in database');
      console.log('🔍 [API BY-USERNAME] ==================\n');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ [API BY-USERNAME] User found!');
    console.log('📊 [API BY-USERNAME] Data:', {
      id: user.id,
      wallet_address: user.wallet_address,
      onboarding_completed: user.onboarding_completed,
      notifications_enabled: user.notifications_enabled
    });
    console.log('🔍 [API BY-USERNAME] ==================\n');
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('❌ [API BY-USERNAME] Exception:', error);
    console.log('🔍 [API BY-USERNAME] ==================\n');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
