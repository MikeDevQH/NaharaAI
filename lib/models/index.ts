import { gemini20FlashConfig } from "@/lib/models/gemini-2-0-flash/config"
import { gemini15FlashConfig } from "./gemini-1-5-pro/config"
import type { ModelConfig } from "@/types/model"

// Export available models
export const availableModels: ModelConfig[] = [gemini20FlashConfig, gemini15FlashConfig]

// Export model configurations
export { gemini20FlashConfig, gemini15FlashConfig }

// Function to get a model by ID
export function getModelById(id: string): ModelConfig {
  return availableModels.find((model) => model.id === id) || gemini20FlashConfig
}

// Function to get a fallback model
export function getFallbackModel(currentModelId: string): ModelConfig {
  if (currentModelId === gemini20FlashConfig.id) return gemini15FlashConfig
  return gemini15FlashConfig
}
