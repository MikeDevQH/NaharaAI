"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import type { Message } from "@/types/chat";
import { AlertCircle, PanelLeftOpen } from "lucide-react";
import { useModel } from "@/contexts/model-context";
import { useConversation } from "@/contexts/conversation-context";
import { generateTitleForGemini } from "@/lib/models/title";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GithubLink } from "@/components/ui/github-link";
import { ModelSelector } from "@/components/models/model-selector";
import { toast } from "@/components/ui/use-toast";

interface ChatWindowProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function ChatWindow({
  isSidebarOpen,
  setIsSidebarOpen,
}: ChatWindowProps) {
  const { selectedModel, generatedTitle, setGeneratedTitle } = useModel();
  const {
    currentConversation,
    updateConversationMessages,
    updateConversationTitle,
  } = useConversation();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Use messages from current conversation
  const messages = currentConversation?.messages || [];

  // Generate title if still at default value and update both model context and conversation context
  useEffect(() => {
    if (!currentConversation) return;

    const isDefaultTitle = currentConversation.title === "New Chat";

    const userMessages = messages.filter((m) => m.role === "user");
    const assistantMessages = messages.filter((m) => m.role === "assistant");

    if (
      isDefaultTitle &&
      userMessages.length >= 2 &&
      assistantMessages.length >= 2 &&
      selectedModel.supportsTitleGeneration
    ) {
      generateTitleForGemini(messages)
        .then((title) => {
          // Update title in conversation context
          updateConversationTitle(currentConversation.id, title);
          // Update title in model context for compatibility
          setGeneratedTitle(title);
        })
        .catch((err) => console.error("Error generating title:", err));
    }
  }, [
    messages,
    currentConversation,
    selectedModel,
    updateConversationTitle,
    setGeneratedTitle,
  ]);

  // Function to stop generation
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch (error) {
        console.error("Error al abortar la solicitud:", error);
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);

        // Add an empty assistant message when generation is stopped
        if (currentConversation) {
          const emptyAssistantMessage: Message = {
            id: Date.now().toString(),
            content: "",
            role: "assistant",
            images: undefined,
          };

          updateConversationMessages([...messages, emptyAssistantMessage]);
        }
      }
    }
  };

  // Function to handle message submission
  const handleSubmit = async (e: React.FormEvent, files?: File[] | null) => {
    e.preventDefault();
    if ((!input.trim() && !files?.length) || !currentConversation) return;

    // Reset states
    setError(null);

    let fileData = null;
    let filesData = null;

    if (files && files.length > 0) {
      // Process files (images, documents, or audio)
      filesData = await Promise.all(
        files.map(async (file) => {
          return new Promise<{
            id: string;
            base64: string;
            mimeType: string;
            fileName?: string;
          }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              const base64 = result.split(",")[1];
              resolve({
                id:
                  Date.now().toString() +
                  Math.random().toString(36).substring(2, 9),
                base64,
                mimeType: file.type,
                fileName: file.name, // Include the file name for documents and audio
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      // For backward compatibility, if there's only one file, also set it as fileData
      if (files.length === 1) {
        fileData = {
          id: filesData[0].id,
          base64: filesData[0].base64,
          mimeType: filesData[0].mimeType,
          fileName: filesData[0].fileName,
        };
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      image: fileData,
      files: filesData,
      images: undefined,
    };

    const updatedMessages = [...messages, userMessage];
    updateConversationMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      // Prepare messages for the API
      const apiMessages = updatedMessages.map((msg) => {
        // If the message has multiple files, convert them to the format expected by the API
        if (msg.files && msg.files.length > 0) {
          return {
            ...msg,
            // Convert the array of files to a format that the API can handle
            image: msg.files[0], 
          };
        }
        return msg;
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModel.id,
        }),
        signal, // Pass the abort signal to the fetch request
      });

       // If the response is not successful, throw an error
       if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error communicating with API")
      }

      // Process the response
      const data = await response.json()

      if (!data.text && !data.error) {
        throw new Error("Response does not contain text")
      }


      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.text || "",
        role: "assistant",
        image: data.image || undefined,
        images: undefined,
      };

      updateConversationMessages([...updatedMessages, assistantMessage]);
    } catch (error: any) {
      console.error("Error:", error);

      if (error.name === "AbortError") {
        console.log("Request was aborted intentionally")
        return
      }

      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(errorMessage);

      // Mostrar toast de error
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-transparent backdrop-blur-md text-blue-800 dark:text-white p-2 md:p-4 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-10">
        <div className="flex items-center mb-2 md:mb-0">
          {!isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="mr-3 h-8 w-8 p-0 text-blue-600 dark:text-blue-300 hover:bg-blue-100/50 dark:hover:bg-blue-800/20 flex-shrink-0"
            >
              <PanelLeftOpen className="h-5 w-5 scale-125" />
            </Button>
          )}
          <h1 className="text-xl font-semibold text-blue-700 dark:text-blue-300 truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
            {currentConversation?.title || generatedTitle || "New Chat"}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <ModelSelector onModelChange={() => {}} />
          <ThemeToggle />
          <GithubLink />
        </div>
      </div>

      {/* Error message if any */}
      {error && (
        <div className="mt-2 mx-4 bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-white p-3 rounded-md flex items-center text-sm">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <p>{error}</p>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-white hover:bg-red-500/30"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Messages */}
      <div ref={contentRef} className="flex-1 overflow-hidden relative">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        {/* Input */}
        <div className="flex justify-center pb-10 pt-2">
          <div className="w-full max-w-4xl mx-auto px-4">
            <ChatInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              onStopGeneration={stopGeneration}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
