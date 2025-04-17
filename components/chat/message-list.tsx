"use client"

import type React from "react"
import type { Message } from "@/types/chat"
import ChatMessage from "./chat-message"
import { WelcomeGuide } from "./welcome-guide"
import { BotIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useRef } from "react"

// TODO: Add props interface
interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

// MessageList component
export function MessageList({ messages, isLoading, messagesEndRef }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)


  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto p-4 space-y-4 h-full scrollbar-custom "
    >
      {messages.length === 0 ? (
        <WelcomeGuide />
      ) : (
        messages.map((message, index) => <ChatMessage key={message.id} message={message} index={index} />)
      )}
      {isLoading && (
        <motion.div
          className="flex items-start gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 shadow-sm">
            <BotIcon size={18} />
          </div>
          <div className="flex-1">
            <div className="space-y-2">
              <div className="h-4 w-1/2 animate-pulse rounded bg-blue-100 dark:bg-blue-900"></div>
            </div>
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
