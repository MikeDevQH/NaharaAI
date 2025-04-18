"use client"

import { BotIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useModel } from "@/contexts/model-context"

// WelcomeGuide component
export function WelcomeGuide() {
  const { selectedModel } = useModel()
  const iconAI = <img src="/NaharaAI-512x512.png" alt="Logo Nahara AI" className="bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 border-blue-200 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-300 dark:border-blue-800 mx-auto mb-2 w-20 h-20 rounded-md " />

  return (
    <motion.div
      className="h-full flex items-center justify-center text-gray-500"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {iconAI}
        </motion.div>
        <p className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">{selectedModel.welcomeMessage}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-4">
        ¿Quieres saber más sobre mí, la app o su desarrollo? Escribe: "info Nahara" 👇
        </p>
      </div>
    </motion.div>
  )
}
