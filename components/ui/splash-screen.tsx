"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SplashScreenProps {
  onFinished: () => void
}

export function SplashScreen({ onFinished }: SplashScreenProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    // Simulate minimum loading time (1.5 seconds)
    const timer = setTimeout(() => {
      setIsAnimating(false)
      // Give time for exit animation to complete
      setTimeout(onFinished, 500)
    }, 2000)

    return () => clearTimeout(timer)
  }, [onFinished])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-600 dark:from-blue-950 dark:via-blue-900 dark:to-indigo-800"
      initial={{ opacity: 1 }}
      animate={{ opacity: isAnimating ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.2,
        }}
        className="text-center"
      >
        <motion.div
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="mb-4"
        >
          <img
            src="/NaharaAI-Logo.png"
            alt="Nahara AI Logo"
            className="w-64 h-64 mx-auto rounded-2xl shadow-lg border-2 border-blue-300 dark:border-blue-700"
          />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
        </motion.h1>

        <motion.div
          className="flex justify-center space-x-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-blue-300 dark:bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
