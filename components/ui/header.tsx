"use client"

import { RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { GithubLink } from "@/components/ui/github-link"
import { motion } from "framer-motion"
import { ModelSelector } from "@/components/models/model-selector"

// Header props
interface HeaderProps {
  onReset: () => void
}

// Header component
export function Header({ onReset }: HeaderProps) {

  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-600 text-white py-4 px-6 shadow-lg z-10 relative dark:from-blue-950 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.h1
          className="text-2xl font-bold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/NaharaAI.png" alt="Logo Nahara AI" className="w-10 h-10 mr-2  rounded-full" />
          Nahara AI
        </motion.h1>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-2">
        <ModelSelector onModelChange={onReset} />

          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                onClick={onReset}
              >
                <RefreshCwIcon className="mr-2" size={16} />
                Reiniciar
              </Button>
            </motion.div>
            <ThemeToggle />
            <GithubLink />
          </div>
        </div>
      </div>
    </header>
  )
}
