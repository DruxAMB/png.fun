import { NextRequest, NextResponse } from "next/server"
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from "@worldcoin/minikit-js"

interface IRequestPayload {
  payload: ISuccessResult
  action: string
  signal: string | undefined
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload
    const app_id = process.env.APP_ID as `app_${string}` || "app_a9e1e8a3c65d60bcf0432ec93883b524"
    
    console.log("Received verification request:", { action, app_id, hasPayload: !!payload })
    
    const verifyRes = (await verifyCloudProof(payload, app_id, action, signal)) as IVerifyResponse
    
    console.log("World ID API response:", verifyRes)

    if (verifyRes.success) {
      // This is where you should perform backend actions if the verification succeeds
      // Such as, setting a user as "verified" in a database
      console.log("Verification successful!")
      return NextResponse.json({ verifyRes, status: 200 })
    } else {
      // This is where you should handle errors from the World ID /verify endpoint.
      // Usually these errors are due to a user having already verified.
      console.log("Verification failed:", verifyRes)
      return NextResponse.json({ verifyRes, status: 400 })
    }
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal verification error",
      status: 500,
      success: false
    }, { status: 500 })
  }
}
