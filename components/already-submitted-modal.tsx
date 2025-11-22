"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { NeoButton } from "@/components/neo-button"
import { CheckCircle2, Clock } from "lucide-react"

interface AlreadySubmittedModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AlreadySubmittedModal({ isOpen, onOpenChange }: AlreadySubmittedModalProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-center pt-8 pb-4">
          <div className="mx-auto bg-green-500 text-white h-20 w-20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10" strokeWidth={3} />
          </div>
          <DrawerTitle className="text-2xl font-black uppercase">
            Already Submitted!
          </DrawerTitle>
          <p className="text-muted-foreground font-bold mt-2">
            You've already submitted your photo for today's challenge
          </p>
        </DrawerHeader>

        <div className="px-6 pb-6">
          <div className="bg-muted rounded-2xl p-4 border-2 border-foreground">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-black text-sm mb-1">Come Back Tomorrow</h3>
                <p className="text-sm text-muted-foreground font-bold">
                  A new challenge will be available in the next 24 hours. Check back then to submit another photo!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs font-bold text-muted-foreground">
              In the meantime, you can vote on other submissions to earn rewards! 🎉
            </p>
          </div>
        </div>

        <DrawerFooter className="px-6 pb-8">
          <NeoButton onClick={() => onOpenChange(false)} className="w-full">
            Got It!
          </NeoButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
