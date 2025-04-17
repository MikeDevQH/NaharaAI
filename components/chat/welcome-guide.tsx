"use client"

import { BotIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useModel } from "@/contexts/model-context"

// WelcomeGuide component
export function WelcomeGuide() {
  const { selectedModel } = useModel()

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
          <BotIcon className="mx-auto mb-4 text-blue-500 dark:text-blue-400" size={48} />
        </motion.div>
        <p className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">{selectedModel.welcomeMessage}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-4">
        ¿Quieres saber más sobre mí, la app o su desarrollo? Escribe: "info Nahara" 👇
        </p>
      </div>
    </motion.div>
  )
}
