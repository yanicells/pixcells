"use client"

import { useEffect } from "react"
import { BubbleBackground } from "@/components/ui/shadcn-io/bubble-background/index"
import { useBackgroundStore } from "@/store/ui.store"

// Detect if user is on mobile device
const isMobileDevice = () => {
  if (typeof window === "undefined") return false

  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = [
    "android",
    "webos",
    "iphone",
    "ipad",
    "ipod",
    "blackberry",
    "windows phone",
  ]
  const isMobileUA = mobileKeywords.some((keyword) =>
    userAgent.includes(keyword)
  )

  const isSmallScreen = window.innerWidth < 1024
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0

  return isMobileUA || (isSmallScreen && isTouchDevice)
}

export function BackgroundWrapper() {
  const { useSimpleBackground, toggleBackground } = useBackgroundStore()

  useEffect(() => {
    const hasPreference = localStorage.getItem("background-store")

    if (!hasPreference && isMobileDevice()) {
      toggleBackground()
    }
  }, [toggleBackground])

  if (useSimpleBackground) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0a1628] to-[#050a14]" />
    )
  }

  return (
    <BubbleBackground
      interactive
      colors={{
        first: '20,30,60',      // Deep navy blue
        second: '30,50,100',    // Rich blue
        third: '40,70,130',     // Medium blue
        fourth: '25,45,80',     // Dark blue
        fifth: '35,60,110',     // Ocean blue
        sixth: '50,80,140'      // Brighter blue
      }}
      className="fixed inset-0 bg-gradient-to-br from-[#0a1628] to-[#050a14] -z-10"
    />
  )
}

