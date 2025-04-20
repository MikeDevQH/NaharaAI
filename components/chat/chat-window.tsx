"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageList } from "./message-list"
import { ChatInput } from "./chat-input"
import type { Message } from "@/types/chat"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { useModel } from "@/contexts/model-context"
import { useConversation } from "@/contexts/conversation-context"
import { generateTitleForGemini } from "@/lib/models/title"

export function ChatWindow() {
  const { selectedModel, generatedTitle, setGeneratedTitle } = useModel()
  const { currentConversation, updateConversationMessages, updateConversationTitle } = useConversation()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Use messages from current conversation
  const messages = currentConversation?.messages || []

  // Generate title if still at default value and update both model context and conversation context
  useEffect(() => {
    if (!currentConversation) return

    const isDefaultTitle = currentConversation.title === "New Chat"

    const userMessages = messages.filter((m) => m.role === "user")
    const assistantMessages = messages.filter((m) => m.role === "assistant")

    if (
      isDefaultTitle &&
      userMessages.length >= 2 &&
      assistantMessages.length >= 2 &&
      selectedModel.supportsTitleGeneration
    ) {
      generateTitleForGemini(messages)
        .then((title) => {
          // Update title in conversation context
          updateConversationTitle(currentConversation.id, title)
          // Update title in model context for compatibility
          setGeneratedTitle(title)
        })
        .catch((err) => console.error("Error generating title:", err))
    }
  }, [messages, currentConversation, selectedModel, updateConversationTitle, setGeneratedTitle])

  // Sync generated title with conversation title
  useEffect(() => {
    if (generatedTitle && currentConversation && currentConversation.title !== generatedTitle) {
      updateConversationTitle(currentConversation.id, generatedTitle)
    }
  }, [generatedTitle, currentConversation, updateConversationTitle])

  const handleSubmit = async (e: React.FormEvent, imageFile?: File | null) => {
    e.preventDefault();
    if ((!input.trim() && !imageFile) || isLoading || !currentConversation) return;

    setError(null);

    let imageData = null;
    if (imageFile) {
      // Convert image to base64
      imageData = await new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          resolve({ base64, mimeType: imageFile.type });
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      image: imageData
        ? {
            id: Date.now().toString(),
            base64: imageData.base64,
            mimeType: imageData.mimeType,
          }
        : undefined,
    };

    const updatedMessages = [...messages, userMessage];
    updateConversationMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          model: selectedModel.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error communicating with API");
      if (!data.text) throw new Error("Response does not contain text");

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.text,
        role: "assistant",
        image: data.image || undefined,
      };

      updateConversationMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);

      const errorResponse: Message = {
        id: Date.now().toString(),
        content: "Sorry, an error has occurred. Please try again.",
        role: "assistant",
      };

      updateConversationMessages([...updatedMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-[calc(100vh-10rem)]" // Adjusted for smaller footer
    >
      <Card className="h-full flex flex-col bg-gradient-to-br from-white/80 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/80 backdrop-blur-md border-blue-200 dark:border-blue-900 shadow-xl transition-colors duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-900 dark:to-indigo-800 text-white rounded-t-lg transition-colors duration-300 flex-shrink-0">
          <CardTitle>{currentConversation?.title || generatedTitle || "New chat"}</CardTitle>
          {error && (
            <div className="mt-2 bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-white p-3 rounded-md flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </CardHeader>

        <CardContent
          ref={contentRef}
          className="flex-1 h-full min-h-0 flex flex-col overflow-hidden p-0 relative"
          style={{ minHeight: "0" }}
        >
          <MessageList messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
        </CardContent>

        <CardFooter className="border-t border-blue-100 dark:border-blue-900 p-4 bg-blue-50/50 dark:bg-blue-950/50 transition-colors duration-300 flex-shrink-0">
          <ChatInput input={input} setInput={setInput} handleSubmit={handleSubmit} isLoading={isLoading} />
        </CardFooter>
      </Card>
    </motion.div>
  )
}
