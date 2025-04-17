"use client"

import { SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FormEvent } from "react"
import { motion } from "framer-motion"

// TODO: Add props interface
interface ChatInputProps {
  input: string
  setInput: (input: string) => void
  handleSubmit: (e: FormEvent) => Promise<void>
  isLoading: boolean
}

export function ChatInput({ input, setInput, handleSubmit, isLoading }: ChatInputProps) {
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex w-full gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        placeholder="Escribe tu mensaje..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
        className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-900 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all duration-300 shadow-sm"
      />
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 shadow-md"
        >
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Enviar</span>
        </Button>
      </motion.div>
    </motion.form>
  )
}
