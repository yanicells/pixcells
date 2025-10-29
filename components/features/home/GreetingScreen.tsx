"use client"

import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import styles from './GreetingScreen.module.css'

export const GreetingScreen = () => {
  const [stage, setStage] = useState<'typing' | 'textFade' | 'bgFade' | 'done'>('typing')
  const [startTyping, setStartTyping] = useState(false)
  const text = "welcome to pixcells"
  
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest))

  useEffect(() => {
    // Signal that greeting is starting
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('greetingShown')
    }
  }, [])

  useEffect(() => {
    // Small delay before typing starts
    setTimeout(() => {
      setStartTyping(true)
    }, 500)
  }, [])

  useEffect(() => {
    if (!startTyping) return

    const controls = animate(count, text.length, {
      type: "tween",
      duration: 2.5,
      ease: "linear"
    })

    controls.then(() => {
      // Wait 1 second after typing, then fade out text
      setTimeout(() => {
        setStage('textFade')
        
        // After text fades, fade the background
        setTimeout(() => {
          setStage('bgFade')
          
          // After background fades, mark as done
          setTimeout(() => {
            setStage('done')
            // Signal that greeting is complete
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('greetingComplete'))
              sessionStorage.setItem('greetingShown', 'true')
            }
          }, 800)
        }, 800)
      }, 1000)
    })

    return controls.stop
  }, [startTyping, text.length, count])

  return (
    <AnimatePresence mode="wait">
      {stage !== 'done' && (
        <motion.div
          className={styles.greeting}
          initial={{ opacity: 1 }}
          animate={{ 
            opacity: stage === 'bgFade' ? 0 : 1 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div 
            className={styles.content}
            animate={{ 
              opacity: stage === 'textFade' || stage === 'bgFade' ? 0 : 1 
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.h1 
              className={styles.text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span>{displayText}</motion.span>
              <motion.span
                className={styles.cursor}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                |
              </motion.span>
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
