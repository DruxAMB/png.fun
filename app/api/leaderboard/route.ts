import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  console.log('[API] Fetching leaderboard...')
  
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    console.log('[API] Leaderboard limit:', limit)

    // Get top users by total WLD earned
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('wallet_address, username, profile_picture_url, total_wins, current_streak, total_wld_earned')
      .order('total_wld_earned', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[API] Error fetching leaderboard:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[API] Leaderboard fetched:', users?.length || 0, 'users')
    return NextResponse.json({ leaderboard: users })
  } catch (error: any) {
    console.error('[API] Leaderboard fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
