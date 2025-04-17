"use client"

import { Button } from "@/components/ui/button"
import { GithubIcon } from "lucide-react"
import { motion } from "framer-motion"

// Github link component
export function GithubLink() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-10 h-10 bg-white/10 hover:bg-white/20 text-white border-none"
        asChild
      >
        <a href="https://github.com/MikeDevQH" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
          <GithubIcon className="w-5 h-5" />
        </a>
      </Button>
    </motion.div>
  )
}
