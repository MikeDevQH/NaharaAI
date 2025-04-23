"use client"

import { useState, useEffect } from "react"
import { ChatWindow } from "@/components/chat/chat-window"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { ThemeProvider } from "@/contexts/theme-context"
import { ModelProvider, useModel } from "@/contexts/model-context"
import { motion, AnimatePresence } from "framer-motion"

import { ConversationProvider } from "@/contexts/conversation-context"
import { Sidebar } from "@/components/sidebar/sidebar"
import { Footer } from "@/components/ui/footer"
import { SplashScreen } from "@/components/ui/splash-screen"

// NOTE: Internal component that manages chat animation and reset
function ChatContainer() {
  const [key, setKey] = useState(0)
  const { selectedModel, setGeneratedTitle } = useModel()
  const [previousModelId, setPreviousModelId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
    setGeneratedTitle(null)
  }

  if (isLoading) {
    return <SplashScreen onFinished={() => setIsLoading(false)} />
  }

  return (
    <div className="flex flex-col h-screen transition-colors duration-300">
      <AnimatedBackground />

      {/* Main content with sidebar and chat */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="flex-1 h-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedModel.id} // Triggers animation when the model changes
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full"
            >
              <ChatWindow key={key} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function ChatPage() {
  // NOTE: Provide theme and model context to the entire chat page
  return (
    <ThemeProvider>
      <ModelProvider>
        <ConversationProvider>
          <ChatContainer />
        </ConversationProvider>
      </ModelProvider>
    </ThemeProvider>
  )
}
