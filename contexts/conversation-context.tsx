"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Conversation } from "@/types/conversation"
import type { Message } from "@/types/chat"
import { useModel } from "./model-context"

type ConversationContextType = {
  conversations: Conversation[]
  currentConversation: Conversation | null
  setCurrentConversation: (conversation: Conversation) => void
  createNewConversation: () => void
  updateConversationMessages: (messages: Message[]) => void
  updateConversationTitle: (id: string, title: string) => void
  deleteConversation: (id: string) => void
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export function ConversationProvider({ children }: { children: ReactNode }) {
  const { selectedModel } = useModel()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversationState] = useState<Conversation | null>(null)
  const [initialLoadDone, setInitialLoadDone] = useState(false)

  // Load conversations from localStorage on startup
  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations")
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations)
        // Convert date strings to Date objects
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
        }))
        setConversations(conversationsWithDates)
      } catch (error) {
        console.error("Error parsing saved conversations:", error)
      }
    }
    setInitialLoadDone(true)
  }, [])

  // Save conversations to localStorage when they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations))
    }
  }, [conversations])

  // Filter conversations by selected model and set current conversation
  useEffect(() => {
    if (!initialLoadDone) return

    const filteredConversations = conversations.filter((conv) => conv.modelId === selectedModel.id)

    if (filteredConversations.length > 0) {
      // If there are conversations for this model and there's no current conversation or the current one is not for this model
      if (!currentConversation || currentConversation.modelId !== selectedModel.id) {
        const mostRecent = filteredConversations.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )[0]
        setCurrentConversationState(mostRecent)
      }
    } else {
      // Only create a new conversation if there are none for this model
      createNewConversation()
    }
  }, [selectedModel.id, initialLoadDone])

  const setCurrentConversation = (conversation: Conversation) => {
    setCurrentConversationState(conversation)
  }

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      modelId: selectedModel.id,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationState(newConversation)
  }

  const updateConversationMessages = (messages: Message[]) => {
    if (!currentConversation) return

    const updatedConversation = {
      ...currentConversation,
      messages,
      updatedAt: new Date(),
    }

    setConversations((prev) => prev.map((conv) => (conv.id === currentConversation.id ? updatedConversation : conv)))

    setCurrentConversationState(updatedConversation)
  }

  const updateConversationTitle = (id: string, title: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === id ? { ...conv, title, updatedAt: new Date() } : conv)))

    if (currentConversation && currentConversation.id === id) {
      setCurrentConversationState({
        ...currentConversation,
        title,
        updatedAt: new Date(),
      })
    }
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))

    if (currentConversation && currentConversation.id === id) {
      const remainingConversations = conversations.filter((conv) => conv.id !== id && conv.modelId === selectedModel.id)

      if (remainingConversations.length > 0) {
        // Select the most recent conversation of the same model
        const mostRecent = remainingConversations.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )[0]
        setCurrentConversationState(mostRecent)
      } else {
        // If there are no conversations left for this model, create a new one
        createNewConversation()
      }
    }
  }

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        currentConversation,
        setCurrentConversation,
        createNewConversation,
        updateConversationMessages,
        updateConversationTitle,
        deleteConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

export function useConversation() {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error("useConversation must be used within a ConversationProvider")
  }
  return context
}
