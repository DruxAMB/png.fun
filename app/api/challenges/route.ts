import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  console.log('[API] Fetching active challenge...')
  
  try {
    const now = new Date()
    console.log('[API] Current time:', now.toISOString())

    // Get active challenge (current day's challenge)
    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .select('*')
      .eq('status', 'active')
      .lte('start_time', now.toISOString())
      .gte('end_time', now.toISOString())
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('[API] Error fetching challenge:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!challenge) {
      console.log('[API] No active challenge found')
      return NextResponse.json({ challenge: null, message: 'No active challenge' })
    }

    console.log('[API] Challenge found:', challenge.id, challenge.title)

    // Calculate prize pool from total WLD voted on all submissions
    console.log('[API] Calculating prize pool for challenge:', challenge.id)
    const { data: submissions, error: submissionsError } = await supabaseAdmin
      .from('submissions')
      .select('total_wld_voted')
      .eq('challenge_id', challenge.id)

    if (submissionsError) {
      console.error('[API] Error fetching submissions for prize pool:', submissionsError)
    }

    const prizePool = submissions?.reduce((sum: number, sub: any) => sum + (sub.total_wld_voted || 0), 0) || 0
    console.log('[API] Prize pool calculated:', prizePool, 'WLD from', submissions?.length || 0, 'submissions')

    const response = { 
      challenge: {
        ...challenge,
        prize_pool: prizePool
      }
    }

    console.log('[API] Returning challenge with prize pool:', response.challenge.prize_pool)
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('[API] Challenge fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
