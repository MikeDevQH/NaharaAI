"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { gemini20FlashConfig } from "@/lib/models"
import type { ModelConfig } from "@/types/model"

// Define available models
export const availableModels: ModelConfig[] = [gemini20FlashConfig]

// Type for the context
type ModelContextType = {
  selectedModel: ModelConfig
  setSelectedModel: (modelId: string) => void
}

// Create the context
const ModelContext = createContext<ModelContextType | undefined>(undefined)

// Provider of the context
export function ModelProvider({ children }: { children: ReactNode }) {
  const [selectedModel, setSelectedModelState] = useState<ModelConfig>(availableModels[0])

  const setSelectedModel = (modelId: string) => {
    const model = availableModels.find((m) => m.id === modelId) || availableModels[0]
    setSelectedModelState(model)
  }

  return <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>{children}</ModelContext.Provider>
}

// Custom hook to use the context
export function useModel() {
  const context = useContext(ModelContext)
  if (context === undefined) {
    throw new Error("useModel must be used within a ModelProvider")
  }
  return context
}
