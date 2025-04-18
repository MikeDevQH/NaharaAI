"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import type { Message } from "@/types/chat";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useModel } from "@/contexts/model-context";
import { generateTitleForGemini } from "@/lib/models/title";

export function ChatWindow() {
  const { selectedModel, generatedTitle, setGeneratedTitle } = useModel();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Resetear mensajes, error y título cuando cambia el modelo
  useEffect(() => {
    setMessages([]);
    setError(null);
    setGeneratedTitle("Nuevo Chat");
  }, [selectedModel, setGeneratedTitle]);

  // Generar título si todavía está en el valor por defecto
  useEffect(() => {
    const isDefaultTitle = generatedTitle === "Nuevo Chat";

    const userMessages = messages.filter((m) => m.role === "user");
    const assistantMessages = messages.filter((m) => m.role === "assistant");

    if (
      isDefaultTitle &&
      userMessages.length >= 2 &&
      assistantMessages.length >= 2 &&
      selectedModel.supportsTitleGeneration
    ) {
      generateTitleForGemini(messages)
        .then((title) => setGeneratedTitle(title))
        .catch((err) => console.error("Error generando título:", err));
    }
  }, [messages, generatedTitle, selectedModel, setGeneratedTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error al comunicarse con la API");
      if (!data.text) throw new Error("La respuesta no contiene texto");

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.text,
        role: "assistant",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);

      const errorResponse: Message = {
        id: Date.now().toString(),
        content: "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.",
        role: "assistant",
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-[calc(100vh-8rem)]"
    >
      <Card className=" h-full flex flex-col bg-gradient-to-br from-white/80 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/80 backdrop-blur-md border-blue-200 dark:border-blue-900 shadow-xl transition-colors duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-900 dark:to-indigo-800 text-white rounded-t-lg transition-colors duration-300 flex-shrink-0">
          <CardTitle>
            {generatedTitle || `Nuevo chat`}
          </CardTitle>
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
          <MessageList
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
        </CardContent>

        <CardFooter className="border-t border-blue-100 dark:border-blue-900 p-4 bg-blue-50/50 dark:bg-blue-950/50 transition-colors duration-300 flex-shrink-0">
          <ChatInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
