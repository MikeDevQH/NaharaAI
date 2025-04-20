"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/ui/header"
import { ChatWindow } from "@/components/chat/chat-window"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { ThemeProvider } from "@/contexts/theme-context"
import { ModelProvider, useModel } from "@/contexts/model-context"
import { motion, AnimatePresence } from "framer-motion"

import { ConversationProvider } from "@/contexts/conversation-context"
import { ConversationSidebar } from "@/components/sidebar/conversation-sidebar"
import { MobileSidebar } from "@/components/sidebar/mobile-sidebar"
import { Footer } from "@/components/ui/footer"
import { SplashScreen } from "@/components/ui/splash-screen"

// NOTE: Internal component that manages chat animation and reset
function ChatContainer() {
  const [key, setKey] = useState(0)
  const { selectedModel, setGeneratedTitle } = useModel()
  const [previousModelId, setPreviousModelId] = useState("")
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return <SplashScreen onFinished={() => setIsLoading(false)} />
  }

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <AnimatedBackground />
      <Header onReset={resetChat} />

      {/* Main content with sidebar and chat */}
      <div className="flex-1 flex justify-center items-start p-4 md:p-6">
        <div className="flex w-full max-w-[1200px] gap-6">
          {/* Sidebar - hidden on mobile, visible on desktop */}
          <div className="w-72 h-[calc(100vh-10rem)] hidden md:block flex-shrink-0">
            <ConversationSidebar />
          </div>

          {/* Chat area - centered and with max width */}
          <div className="flex-1 flex justify-center">
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
                className="w-full max-w-4xl"
              >
                <ChatWindow key={key} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile sidebar */}
        <MobileSidebar />
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
