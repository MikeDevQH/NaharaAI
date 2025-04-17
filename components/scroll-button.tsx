"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface ScrollButtonProps {
  onClick: () => void
}

export function ScrollButton({ onClick }: ScrollButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-24 right-8 bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors z-10"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      aria-label="Scroll to bottom"
    >
      <ChevronDown size={20} />
    </motion.button>
  )
}
