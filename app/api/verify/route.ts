import { NextRequest, NextResponse } from "next/server"
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from "@worldcoin/minikit-js"
import { supabaseAdmin } from "@/lib/supabase"

interface IRequestPayload {
  payload: ISuccessResult
  action: string
  signal: string | undefined
  walletAddress?: string
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal, walletAddress } = (await req.json()) as IRequestPayload
    const app_id = process.env.APP_ID as `app_${string}` || "app_a9e1e8a3c65d60bcf0432ec93883b524"
    
    console.log("[API] Received verification request:", { action, app_id, hasPayload: !!payload, walletAddress })
    
    const verifyRes = (await verifyCloudProof(payload, app_id, action, signal)) as IVerifyResponse
    
    console.log("[API] World ID API response:", verifyRes)

    if (verifyRes.success) {
      console.log("[API] Verification successful!")
      
      // Mark user as World ID verified in database
      if (walletAddress) {
        console.log("[API] Marking user as World ID verified:", walletAddress)
        const { error } = await supabaseAdmin
          .from('users')
          .update({ world_id_verified: true })
          .eq('wallet_address', walletAddress)
        
        if (error) {
          console.error("[API] Error updating user verification status:", error)
        } else {
          console.log("[API] User marked as verified successfully")
        }
      }
      
      return NextResponse.json({ verifyRes, status: 200 })
    } else {
      console.log("[API] Verification failed:", verifyRes)
      return NextResponse.json({ verifyRes, status: 400 })
    }
  } catch (error) {
    console.error("[API] Verification error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal verification error",
      status: 500,
      success: false
    }, { status: 500 })
  }
}
