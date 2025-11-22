"use client"

import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { NeoButton } from "@/components/neo-button"
import { ScanFace } from "lucide-react"
import { MiniKit, VerificationLevel, ISuccessResult } from "@worldcoin/minikit-js"
import { useState, useCallback } from "react"

interface HumanVerificationModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onVerify: (photoUrl?: string) => void
}

export function HumanVerificationModal({ isOpen, onOpenChange, onVerify }: HumanVerificationModalProps) {
  const [loading, setLoading] = useState(false)

  const handleVerify = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit not installed, falling back to mock verification for browser testing")
      // For browser testing without MiniKit - open camera directly
      openCamera()
      return
    }

    setLoading(true)
    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: "verifyhuman", // This is your action ID from the Developer Portal
        verification_level: VerificationLevel.Orb, // or VerificationLevel.Device
      })

      if (finalPayload.status === "success") {
        console.log("World ID verification successful, sending to backend...")
        const verifyRes = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: finalPayload as ISuccessResult,
            action: "verifyhuman",
            signal: undefined, // Optional
          }),
        })

        const verifyData = await verifyRes.json()
        console.log("Backend verification response:", verifyData)
        
        // Check if backend verification succeeded
        if (verifyData.status === 200 || verifyData.verifyRes?.success) {
          console.log("Backend verification successful! Opening camera...")
          // Verification successful - now open camera
          openCamera()
        } else {
          console.error("Verification failed backend check:", verifyData)
        }
      } else {
        console.error("World ID verification failed:", finalPayload)
      }
    } catch (error) {
      console.error("Verification error:", error)
    } finally {
      setLoading(false)
    }
  }, [onVerify])

  const openCamera = () => {
    // Close the modal first`
    onOpenChange(false)
    
    // Wait a bit for modal to close, then open camera
    setTimeout(() => {
      // Create a file input element to access camera
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment' // Use rear camera
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string
            // Call onVerify with the captured image
            onVerify(imageUrl)
          }
          reader.readAsDataURL(file)
        }
      }
      
      input.click()
    }, 300) // 300ms delay to allow modal to close
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-center pt-8 pb-4">
          <div className="mx-auto bg-muted h-20 w-20 rounded-full flex items-center justify-center mb-4">
            <ScanFace className="h-10 w-10 text-muted-foreground" />
          </div>
          <DrawerTitle className="text-2xl font-black uppercase">Human Verification</DrawerTitle>
          <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
            Please verify your World ID to capture and submit your daily challenge photo.
          </p>
        </DrawerHeader>
        <DrawerFooter className="pb-8 px-4">
          <NeoButton variant="primary" size="lg" onClick={handleVerify} className="w-full" disabled={loading}>
            <ScanFace className="mr-2 h-5 w-5" />
            {loading ? "Verifying..." : "Verify World ID"}
          </NeoButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
