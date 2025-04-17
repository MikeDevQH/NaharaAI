import { gemini20FlashConfig } from "@/lib/models/gemini-2-0-flash/config"
import type { ModelConfig } from "@/types/model"

// Export available models
export const availableModels: ModelConfig[] = [gemini20FlashConfig]

// Export model configurations
export { gemini20FlashConfig }

// Function to get a model by ID
export function getModelById(id: string): ModelConfig {
  return availableModels.find((model) => model.id === id) || gemini20FlashConfig
}

// Function to get a fallback model
export function getFallbackModel(modelId: any): ModelConfig {
  return gemini20FlashConfig
}
