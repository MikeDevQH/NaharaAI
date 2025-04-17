import { NextResponse } from "next/server"
import { getModelById, getFallbackModel } from "@/lib/models"

// NOTE: Main POST handler for chat API endpoint
export async function POST(request: Request) {
  try {
    // NOTE: Extract messages and model ID from request body, defaulting to 'gemini-2.0-flash'
    const { messages, model: modelId = "gemini-2.0-flash" } = await request.json()

    // ! Validate that messages array exists
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Se requiere un array de mensajes" }, { status: 400 })
    }

    // ! Check that there is at least one user message
    if (!messages.some((msg) => msg.role === "user")) {
      return NextResponse.json({ error: "Se requiere al menos un mensaje del usuario" }, { status: 400 })
    }

    // NOTE: Get configuration for the selected model
    const modelConfig = getModelById(modelId)

    try {
      // NOTE: Find the last user message in the conversation
      const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")

      // ! If no user message is found, throw an error
      if (!lastUserMessage) {
        throw new Error("No se encontró un mensaje del usuario")
      }

      // NOTE: Build conversation history excluding the last user message
      const conversationHistory = messages
        .filter((msg) => msg.id !== lastUserMessage.id) 
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }))

      // NOTE: Prepare user content with system prompt for context
      const userContent = lastUserMessage.content
      const enhancedContent = `${modelConfig.systemPrompt}\n\nUsuario: ${userContent}`

      // NOTE: Construct request body for Gemini API
      const requestBody = {
        contents: [
          ...conversationHistory,
          {
            role: "user",
            parts: [{ text: enhancedContent }],
          },
        ],
        generationConfig: modelConfig.generationConfig,
      }

      // TODO: Retrieve Gemini API credentials from environment variables
      const apiKey = process.env.GEMINI_API_KEY
      const apiUrl = process.env.GEMINI_API_URL
      const response = await fetch(`${apiUrl}/${modelConfig.id}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      // ! Handle Gemini API errors
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error de la API de Gemini:", errorData)
        throw new Error(`Error de la API de Gemini: ${JSON.stringify(errorData)}`)
      }

      // NOTE: Parse response from Gemini API
      const data = await response.json()

      // NOTE: Extract text from the first candidate in the response
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text

      // ! If no text is found in the response, throw an error
      if (!text) {
        throw new Error("La respuesta no contiene texto")
      }

      // NOTE: Return the generated text as JSON
      return NextResponse.json({ text })
    } catch (modelError) {
      // ! Handle specific model error and attempt fallback
      console.error("Error específico del modelo:", modelError)

      try {
        // NOTE: Get fallback model configuration
        const fallbackModelConfig = getFallbackModel(modelId)
        console.log(`Intentando con modelo de fallback: ${fallbackModelConfig.id}`)

        // NOTE: Find the last user message again for fallback
        const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")

        // ! If no user message is found, throw an error
        if (!lastUserMessage) {
          throw new Error("No se encontró un mensaje del usuario")
        }

        // NOTE: Prepare user content with fallback system prompt
        const userContent = lastUserMessage.content
        const enhancedContent = `${fallbackModelConfig.systemPrompt}\n\nUsuario: ${userContent}`

        // NOTE: Build request body for fallback model
        const requestBody = {
          contents: [
            {
              role: "user",
              parts: [{ text: enhancedContent }],
            },
          ],
          generationConfig: fallbackModelConfig.generationConfig,
        }

        // TODO: Use same Gemini API credentials for fallback
        const apiKey = process.env.GEMINI_API_KEY
        const apiUrl = process.env.GEMINI_API_URL
        const response = await fetch(`${apiUrl}/${fallbackModelConfig.id}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        // ! Handle fallback API errors
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Error de la API de Gemini (fallback): ${JSON.stringify(errorData)}`)
        }

        // NOTE: Parse response from fallback model
        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text

        // ! If no text is found in fallback response, throw an error
        if (!text) {
          throw new Error("La respuesta de fallback no contiene texto")
        }

        // NOTE: Return fallback model result with warning
        return NextResponse.json({
          text,
          warning: `Se utilizó el modelo de respaldo ${fallbackModelConfig.name} porque el modelo original ${modelConfig.name} falló.`,
        })
      } catch (fallbackError) {
        // ! If fallback also fails, log and throw error
        console.error("Error en modelo alternativo:", fallbackError)
        throw new Error("No se pudo generar respuesta con ningún modelo disponible")
      }
    }
  } catch (error) {
    // ! Catch-all for any unhandled errors
    console.error("Error en la API de chat:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error al procesar la solicitud",
      },
      { status: 500 },
    )
  }
}

