// Model capabilities interface
export interface ModelCapabilities {
  text: boolean
  images: boolean
  documents: boolean
  code: boolean
}
// Model configuration interface
export interface ModelConfig {
  id: string
  name: string
  description: string
  displayName: string
  welcomeMessage: string
  apiEndpoint: string
  capabilities: ModelCapabilities
  generationConfig: {
    temperature: number
    maxOutputTokens: number
    [key: string]: any
  }
  systemPrompt: string
  supportsTitleGeneration?: boolean
}
