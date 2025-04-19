import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { getModelById, getFallbackModel } from "@/lib/models"

export async function POST(request: Request) {
  try {
    const { messages, model: modelId = "gemini-2.0-flash" } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Se requiere un array de mensajes" }, { status: 400 })
    }

    if (!messages.some((msg) => msg.role === "user")) {
      return NextResponse.json({ error: "Se requiere al menos un mensaje del usuario" }, { status: 400 })
    }

    const modelConfig = getModelById(modelId)
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")

    if (!lastUserMessage) {
      throw new Error("No se encontró un mensaje del usuario")
    }

    const conversationHistory = messages
      .filter((msg) => msg.id !== lastUserMessage.id)
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }))

    const userContent = lastUserMessage.content
    const enhancedContent = `${modelConfig.systemPrompt}\n\nUsuario: ${userContent}`

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("Falta la API Key de Gemini")

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
    if (!text) throw new Error("La respuesta no contiene texto")

    return NextResponse.json({ text })
  } catch (modelError) {
    console.error("Error específico del modelo:", modelError)

    try {
      const { messages, model: modelId = "gemini-2.0-flash" } = await request.json()
      const fallbackModelConfig = getFallbackModel(modelId)

      const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")
      if (!lastUserMessage) throw new Error("No se encontró un mensaje del usuario")

      const userContent = lastUserMessage.content
      const enhancedContent = `${fallbackModelConfig.systemPrompt}\n\nUsuario: ${userContent}`

      const apiKey = process.env.GEMINI_API_KEY
      if (!apiKey) throw new Error("Falta la API Key de Gemini")

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
      if (!text) throw new Error("La respuesta de fallback no contiene texto")

      return NextResponse.json({
        text,
        warning: `Se utilizó el modelo de respaldo ${fallbackModelConfig.name} porque el modelo original falló.`,
      })
    } catch (fallbackError) {
      console.error("Error en modelo alternativo:", fallbackError)
      return NextResponse.json(
        { error: "No se pudo generar respuesta con ningún modelo disponible" },
        { status: 500 },
      )
    }
  }
}
