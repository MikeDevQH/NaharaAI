import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { getModelById, getFallbackModel } from "@/lib/models"

export async function POST(request: Request) {
  try {
    const { messages, model: modelId = "gemini-2.0-flash" } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "An array of messages is required" }, { status: 400 })
    }

    if (!messages.some((msg) => msg.role === "user")) {
      return NextResponse.json({ error: "At least one user message is required" }, { status: 400 })
    }

    const modelConfig = getModelById(modelId)
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")

    if (!lastUserMessage) {
      throw new Error("No user message found")
    }

    const conversationHistory = messages
      .filter((msg) => msg.id !== lastUserMessage.id)
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }))

    const userContent = lastUserMessage.content
    const enhancedContent = `${modelConfig.systemPrompt}

User: ${userContent}`

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("Gemini API Key is missing")

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: modelConfig.id,
      generationConfig: modelConfig.generationConfig,
    })

    const result = await model.generateContent({
      contents: [
        ...conversationHistory,
        {
          role: "user",
          parts: [{ text: enhancedContent }],
        },
      ],
    })

    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error("Response does not contain text")

    return NextResponse.json({ text })
  } catch (modelError) {
    console.error("Model-specific error:", modelError)

    try {
      const { messages, model: modelId = "gemini-2.0-flash" } = await request.json()
      const fallbackModelConfig = getFallbackModel(modelId)

      const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")
      if (!lastUserMessage) throw new Error("No user message found")

      const userContent = lastUserMessage.content
      const enhancedContent = `${fallbackModelConfig.systemPrompt}

User: ${userContent}`

      const apiKey = process.env.GEMINI_API_KEY
      if (!apiKey) throw new Error("Gemini API Key is missing")

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: fallbackModelConfig.id,
        generationConfig: fallbackModelConfig.generationConfig,
      })

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: enhancedContent }],
          },
        ],
      })

      const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error("Fallback response does not contain text")

      return NextResponse.json({
        text,
        warning: `The fallback model ${fallbackModelConfig.name} was used because the original model failed.`,
      })
    } catch (fallbackError) {
      console.error("Fallback model error:", fallbackError)
      return NextResponse.json({ error: "Could not generate response with any available model" }, { status: 500 })
    }
  }
}
