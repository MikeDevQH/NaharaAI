"use client"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { GithubLink } from "@/components/ui/github-link"
import { motion } from "framer-motion"
import { ModelSelector } from "@/components/models/model-selector"
import Link from "next/link"

// Header props
interface HeaderProps {
  onReset: () => void
}

// Modify Header component
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
          <Link href="/" className="flex items-center gap-2">
            <img src="/NaharaAI.png" alt="Nahara AI Logo" className="w-10 h-10 rounded-full" />
            <span>Nahara AI</span>
          </Link>
        </motion.h1>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-2">
          <ModelSelector onModelChange={onReset} />

          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
            </motion.div>
            <ThemeToggle />
            <GithubLink />
          </div>
        </div>
      </div>
    </header>
  )
}
