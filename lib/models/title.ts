import type { Message } from "@/types/chat"

export async function generateTitleForGemini(messages: Message[]): Promise<string> {
  const prompt = `
Dado el siguiente historial de conversación entre un usuario y una IA, genera un título breve y descriptivo que resuma el tema principal. Sé claro, creativo, no uses comillas y el titulo debe ser corto. No repitas "Conversación con Nahara" ni cosas similares.

Historial:
${messages.map((msg) => `${msg.role === "user" ? "Usuario" : "Nahara"}: ${msg.content}`).join("\n")}

Título:
  `.trim()

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      model: "gemini-1.5-flash",
    }),
  })

  const data = await response.json()
  if (!data.text) throw new Error("No se pudo generar el título")

  return data.text.trim()
}
