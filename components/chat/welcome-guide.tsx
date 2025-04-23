"use client"
import { motion } from "framer-motion"
import { useModel } from "@/contexts/model-context"

// WelcomeGuide component
export function WelcomeGuide() {
  const { selectedModel } = useModel()
  const iconAI = (
    <img
      src="/NaharaAI-512x512.png"
      alt="Nahara AI Logo"
      className="bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 border-blue-200 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-300 dark:border-blue-800 mx-auto mb-4 w-24 h-24 rounded-2xl shadow-md"
    />
  )

  return (
    <motion.div
      className="h-full flex items-center justify-center text-gray-500"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center max-w-md mx-auto p-8 rounded-2xl">
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
        <p className="text-xl font-medium text-blue-700 dark:text-blue-300 mb-4">{selectedModel.welcomeMessage}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-6">
          Want to know more about me, the app, or its development? Type: "info Nahara" 👇
        </p>
      </div>
    </motion.div>
  )
}
