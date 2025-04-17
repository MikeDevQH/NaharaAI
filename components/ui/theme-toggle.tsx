"use client"

import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { SunIcon, MoonIcon } from "lucide-react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden rounded-full w-10 h-10 bg-white/10 hover:bg-white/20 text-white border-none"
    >
      <div className="relative w-5 h-5">
        {theme === "light" ? (
          <motion.div
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <SunIcon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <MoonIcon className="w-5 h-5" />
          </motion.div>
        )}
      </div>
    </Button>
  )
}
