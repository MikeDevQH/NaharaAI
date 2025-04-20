import type { Message } from "./chat"

export interface Conversation {
  id: string
  title: string
  modelId: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}
