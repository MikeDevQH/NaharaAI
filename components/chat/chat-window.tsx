"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageList } from "./message-list"
import { ChatInput } from "./chat-input"
import type { Message } from "@/types/chat"
import { AlertCircle, PanelLeftOpen } from "lucide-react"
import { useModel } from "@/contexts/model-context"
import { useConversation } from "@/contexts/conversation-context"
import { generateTitleForGemini } from "@/lib/models/title"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { GithubLink } from "@/components/ui/github-link"
import { ModelSelector } from "@/components/models/model-selector"

interface ChatWindowProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

export function ChatWindow({ isSidebarOpen, setIsSidebarOpen }: ChatWindowProps) {
  const { selectedModel, generatedTitle, setGeneratedTitle } = useModel()
  const { currentConversation, updateConversationMessages, updateConversationTitle } = useConversation()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Use messages from current conversation
  const messages = currentConversation?.messages || []

  // Generate title if still at default value and update both model context and conversation context
  useEffect(() => {
    if (!currentConversation) return

    const isDefaultTitle = currentConversation.title === "New Chat"

    const userMessages = messages.filter((m) => m.role === "user")
    const assistantMessages = messages.filter((m) => m.role === "assistant")

    if (
      isDefaultTitle &&
      userMessages.length >= 2 &&
      assistantMessages.length >= 2 &&
      selectedModel.supportsTitleGeneration
    ) {
      generateTitleForGemini(messages)
        .then((title) => {
          // Update title in conversation context
          updateConversationTitle(currentConversation.id, title)
          // Update title in model context for compatibility
          setGeneratedTitle(title)
        })
        .catch((err) => console.error("Error generating title:", err))
    }
  }, [messages, currentConversation, selectedModel, updateConversationTitle, setGeneratedTitle])

  const handleSubmit = async (e: React.FormEvent, imageFiles?: File[] | null) => {
    e.preventDefault()
    if ((!input.trim() && !imageFiles?.length) || isLoading || !currentConversation) return

    setError(null)

    let imageData = null
    let imagesData = null

    if (imageFiles && imageFiles.length === 1) {
      // NOTE: Maintain compatibility with the previous format for a single image
      const file = imageFiles[0]
      imageData = await new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          const base64 = result.split(",")[1]
          resolve({ base64, mimeType: file.type })
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    } else if (imageFiles && imageFiles.length > 1) {
      // NOTE: Process multiple images
      imagesData = await Promise.all(
        imageFiles.map(async (file) => {
          return new Promise<{ id: string; base64: string; mimeType: string }>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
              const result = reader.result as string
              const base64 = result.split(",")[1]
              resolve({
                id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                base64,
                mimeType: file.type,
              })
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
        }),
      )
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      image: imageData
        ? {
            id: Date.now().toString(),
            base64: imageData.base64,
            mimeType: imageData.mimeType,
          }
        : undefined,
      images: imagesData || undefined,
    }

    const updatedMessages = [...messages, userMessage]
    updateConversationMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      // NOTE: Prepare messages for the API
      const apiMessages = updatedMessages.map((msg) => {
        // NOTE: If the message has multiple images, convert them to the format expected by the API
        if (msg.images && msg.images.length > 0) {
          return {
            ...msg,
            // NOTE: Convert the array of images to a format that the API can handle
            image: msg.images[0], // Currently, only the first image is used for compatibility
          }
        }
        return msg
      })

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModel.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Error communicating with API")
      if (!data.text) throw new Error("Response does not contain text")

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.text,
        role: "assistant",
        image: data.image || undefined,
      }

      updateConversationMessages([...updatedMessages, assistantMessage])
    } catch (error) {
      console.error("Error:", error)

      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(errorMessage)

      const errorResponse: Message = {
        id: Date.now().toString(),
        content: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.",
        role: "assistant",
      }

      updateConversationMessages([...updatedMessages, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-transparent backdrop-blur-md text-blue-800 dark:text-white p-2 md:p-4 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-10">
        <div className="flex items-center mb-2 md:mb-0">
          {!isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="mr-3 h-8 w-8 p-0 text-blue-600 dark:text-blue-300 hover:bg-blue-100/50 dark:hover:bg-blue-800/20 flex-shrink-0"
            >
              <PanelLeftOpen className="h-5 w-5 scale-125" />
            </Button>
          )}
          <h1 className="text-xl font-semibold text-blue-700 dark:text-blue-300 truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
            {currentConversation?.title || generatedTitle || "New Chat"}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <ModelSelector onModelChange={() => {}} />
          <ThemeToggle />
          <GithubLink />
        </div>
      </div>

      {/* Error message if any */}
      {error && (
        <div className="mt-2 mx-4 bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-white p-3 rounded-md flex items-center text-sm">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Messages */}
      <div ref={contentRef} className="flex-1 overflow-hidden relative pb-16">
        <MessageList messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 flex justify-center fixed bottom-8 left-0 right-0 z-10">
        <div className="w-full max-w-4xl mx-auto px-2">
          <ChatInput input={input} setInput={setInput} handleSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
