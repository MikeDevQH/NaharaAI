"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/ui/header"
import { ChatWindow } from "@/components/chat/chat-window"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { ThemeProvider } from "@/contexts/theme-context"
import { ModelProvider, useModel } from "@/contexts/model-context"
import { motion, AnimatePresence } from "framer-motion"

// NOTE: Internal component that manages chat animation and reset
function ChatContainer() {
  const [key, setKey] = useState(0)
  const { selectedModel } = useModel()
  const [previousModelId, setPreviousModelId] = useState("")

  // NOTE: Reset chat when the selected model changes
  useEffect(() => {
    if (previousModelId && previousModelId !== selectedModel.id) {
      setKey((prev) => prev + 1) // Forces ChatWindow to re-mount
    }
    setPreviousModelId(selectedModel.id)
  }, [selectedModel.id, previousModelId])

  // NOTE: Handler to manually reset the chat
  const resetChat = () => {
    setKey((prev) => prev + 1)
  }

  // NOTE: Animation variants for page transitions
  const variants = {
    enter: {
      x: "100%",
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: "-100%",
      opacity: 0,
    },
  }

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <AnimatedBackground />
      <Header onReset={resetChat} />

      <main className="flex-1 container mx-auto p-4 md:p-6 max-w-4xl relative z-0 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedModel.id} // Triggers animation when the model changes
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full h-full"
          >
            <ChatWindow key={key} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default function ChatPage() {
  // NOTE: Provide theme and model context to the entire chat page
  return (
    <ThemeProvider>
      <ModelProvider>
        <ChatContainer />
      </ModelProvider>
    </ThemeProvider>
  )
}
