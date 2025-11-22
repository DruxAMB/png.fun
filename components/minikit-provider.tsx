"use client"

import { ReactNode, useEffect } from "react"
import { MiniKit } from "@worldcoin/minikit-js"

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install("app_a9e1e8a3c65d60bcf0432ec93883b524")
  }, [])

  return <>{children}</>
}
