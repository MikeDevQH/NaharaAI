"use client"

import { UserIcon } from "lucide-react"
import type { Message } from "@/types/chat"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useModel } from "@/contexts/model-context"
import ReactMarkdown from "react-markdown"

// TODO: Add props interface
interface ChatMessageProps {
  message: Message
  index: number
}

// TODO: Add component description
export default function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user"
  const { selectedModel } = useModel()
  const iconAI = <img src="/NaharaAI.png" alt="Nahara AI Logo" className="w-7 h-7 rounded-full " />

  return (
    <motion.div
      className="flex items-start gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm",
          isUser
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-700 dark:from-blue-700 dark:to-blue-600 dark:border-blue-800"
            : "bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 border-blue-200 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-300 dark:border-blue-800",
        )}
      >
        {isUser ? <UserIcon size={18} /> : iconAI}
      </div>
      <div className="flex-1">
        <div className="space-y-2">
          <div className="text-sm font-bold text-blue-800 dark:text-blue-300">{isUser ? "You" : "Nahara"}</div>
          <div className="text-blue-900 dark:text-blue-100 whitespace-pre-wrap bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-blue-100 dark:border-blue-900">
            {message.image && message.image.base64 && message.image.mimeType && (
              <img
                src={`data:${message.image.mimeType};base64,${message.image.base64}`}
                alt="User upload"
                className="mb-2 rounded max-w-xs max-h-60 object-contain border border-blue-200 dark:border-blue-800 shadow"
              />
            )}
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
