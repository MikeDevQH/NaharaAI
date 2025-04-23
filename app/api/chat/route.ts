import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getModelById, getFallbackModel } from "@/lib/models";

export async function POST(request: Request) {
  try {
    const { messages, model: modelId = "gemini-2.0-flash" } =
      await request.json();

    // NOTE: Ensure the request contains a valid array of messages
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "An array of messages is required" },
        { status: 400 }
      );
    }

    // WARNING: There must be at least one user message in the conversation
    if (!messages.some((msg) => msg.role === "user")) {
      return NextResponse.json(
        { error: "At least one user message is required" },
        { status: 400 }
      );
    }

    const modelConfig = getModelById(modelId);
    // NOTE: Get the most recent user message for context
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "user");

    if (!lastUserMessage) {
      // WARNING: Should never occur due to earlier check, but double safety
      throw new Error("No user message found");
    }

    // NOTE: Build conversation history excluding the last user message
    const conversationHistory = messages
      .filter((msg) => msg.id !== lastUserMessage.id)
      .map((msg) => {
        const parts = [];
        if (msg.image && msg.image.base64 && msg.image.mimeType) {
          parts.push({
            inlineData: {
              mimeType: msg.image.mimeType,
              data: msg.image.base64,
            },
          });
        }
        if (msg.content) {
          parts.push({ text: msg.content });
        }
        return {
          role: msg.role === "user" ? "user" : "model",
          parts,
        };
      });
    const userParts = [];
    if (
      lastUserMessage.image &&
      lastUserMessage.image.base64 &&
      lastUserMessage.image.mimeType
    ) {
      userParts.push({
        inlineData: {
          mimeType: lastUserMessage.image.mimeType,
          data: lastUserMessage.image.base64,
        },
      });
    }
    if (lastUserMessage.content) {
      userParts.push({ text: lastUserMessage.content });
    }

    const userContent = lastUserMessage.content;
    const enhancedContent = `${modelConfig.systemPrompt}

User: ${userContent}`;

    // WARNING: The Gemini API key must be set in the environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API Key is missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelConfig.id,
      generationConfig: modelConfig.generationConfig,
    });

    // TODO: If an image is present and the user requests detection or segmentation, modify prompt accordingly
    let prompt = lastUserMessage.content;
    let isDetection = false;
    if (
      lastUserMessage.image &&
      /box|detect|object|segment|mask|cuadro|diferencias|diferente|bounding|segmenta|segmentation/i.test(
        prompt
      )
    ) {
      // NOTE: Add detection instruction for bounding boxes
      prompt = `${prompt}\nDetect the all of the prominent items in the image. The box_2d should be [ymin, xmin, ymax, xmax] normalized to 0-1000.`;
      isDetection = true;
    }
    if (
      lastUserMessage.image &&
      /segment|mask|segmenta|segmentación|contorno/i.test(prompt)
    ) {
      // NOTE: Add segmentation instruction for masks and labels
      prompt = `Give the segmentation masks for the objects. Output a JSON list of segmentation masks where each entry contains the 2D bounding box in the key \"box_2d\", the segmentation mask in key \"mask\", and the text label in the key \"label\". Use descriptive labels.\n${prompt}`;
      isDetection = true;
    }

    const result = await model.generateContent({
      contents: [
        ...conversationHistory,
        {
          role: "user",
          parts: [
            ...(lastUserMessage.image &&
            lastUserMessage.image.base64 &&
            lastUserMessage.image.mimeType
              ? [
                  {
                    inlineData: {
                      mimeType: lastUserMessage.image.mimeType,
                      data: lastUserMessage.image.base64,
                    },
                  },
                ]
              : []),
            { text: enhancedContent },
          ],
        },
      ],
    });

    if (isDetection) {
      // NOTE: Handle detection/segmentation response separately
      const detectionResult =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!detectionResult)
        throw new Error("Detection response does not contain text");
      return NextResponse.json({ text: detectionResult });
    }

    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Response does not contain text");

    return NextResponse.json({ text });
  } catch (modelError) {
    console.error("Model-specific error:", modelError);

    try {
      const { messages, model: modelId = "gemini-2.0-flash" } =
        await request.json();
      const fallbackModelConfig = getFallbackModel(modelId);

      const lastUserMessage = [...messages]
        .reverse()
        .find((msg) => msg.role === "user");
      if (!lastUserMessage) throw new Error("No user message found");

      const userContent = lastUserMessage.content;
      const enhancedContent = `${fallbackModelConfig.systemPrompt}

User: ${userContent}`;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API Key is missing");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: fallbackModelConfig.id,
        generationConfig: fallbackModelConfig.generationConfig,
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: enhancedContent }],
          },
        ],
      });

      const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Fallback response does not contain text");

      return NextResponse.json({
        text,
        warning: `The fallback model ${fallbackModelConfig.name} was used because the original model failed.`,
      });
    } catch (fallbackError) {
      console.error("Fallback model error:", fallbackError);
      return NextResponse.json(
        { error: "Could not generate response with any available model" },
        { status: 500 }
      );
    }
  }
}
