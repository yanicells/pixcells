"use client"

import { motion } from "framer-motion"
import { Sparkles, Palette } from "lucide-react"
import { useBackgroundStore } from "@/store/ui.store"

export function BackgroundToggle() {
  const { useSimpleBackground, toggleBackground } = useBackgroundStore()

  return (
    <motion.button
      onClick={toggleBackground}
      className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full backdrop-blur-[11.9px] border border-white/30 transition-all duration-300 overflow-hidden group"
      style={{
        background: "rgba(255, 255, 255, 0.19)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
      }}
      whileTap={{ scale: 0.95 }}
      title={
        useSimpleBackground
          ? "Enable animated background"
          : "Disable animations (better performance)"
      }
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.8 }}
      />

      {/* Icon with rotation animation */}
      <motion.div
        className="relative z-10"
        initial={false}
        animate={{ rotate: useSimpleBackground ? 0 : 360 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {useSimpleBackground ? (
          <Sparkles className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
        ) : (
          <Palette className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
        )}
      </motion.div>
    </motion.button>
  )
}

