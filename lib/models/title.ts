import type { Message } from "@/types/chat"

// This function generates a brief and descriptive title summarizing the main topic of the conversation
export async function generateTitleForGemini(messages: Message[]): Promise<string> {
  const prompt = `
Given the following conversation history between a user and an AI, generate a brief and descriptive title that summarizes the main topic. Be clear, creative, do not use quotes, and the title should be short. Do not repeat phrases like "Conversation with Nahara" or similar.

Conversation history:
${messages.map((msg) => `${msg.role === "user" ? "User" : "Nahara"}: ${msg.content}`).join("\n")}

Title:
  `.trim()

  // Sending the prompt to the chat API with the model "gemini-2.0-flash"
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],  
      model: "gemini-2.0-flash",  
    }),
  })


  const data = await response.json()
  if (!data.text) throw new Error("Unable to generate title")
  return data.text.trim()
}
