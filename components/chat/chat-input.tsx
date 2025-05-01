"use client";

import { SendIcon, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { FormEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { UploadButton } from "./UploadButton";
import { MultiFilePreview } from "./FilePreview";
import { useModel } from "@/contexts/model-context";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: FormEvent, files?: File[] | null) => Promise<void>;
  isLoading: boolean;
  onStopGeneration: () => void;
}

// NOTE: Maximum number of files allowed per message
const MAX_FILES = 3;

export function ChatInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
  onStopGeneration,
}: ChatInputProps) {
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { selectedModel } = useModel();

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // NOTE: Adds files if under limit and model supports images
  const addFile = (file: File) => {
    // Check if the model supports the file type
    const isImage = file.type.startsWith("image/");
    const isDocument = file.type === "application/pdf";
    const isAudio = file.type.startsWith("audio/");

    // Only allow files if the model has the corresponding capability
    if (
      (isImage && !selectedModel.capabilities.images) ||
      (isDocument && !selectedModel.capabilities.documents) ||
      (isAudio && !selectedModel.capabilities.audio)
    ) {
      alert(
        `El modelo ${selectedModel.name} no soporta archivos de tipo ${file.type}`
      );
      return;
    }

    if (files.length < MAX_FILES) {
      setFiles((prev) => [...prev, file]);
    }
    // WARNING: Exceeding the file limit will silently do nothing
  };

  // NOTE: Removes file by index from the files array
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle keyboard events for textarea
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // If Enter is pressed without Shift, submit the form
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (input.trim() || files.length > 0) {
        const formEvent = e.nativeEvent as unknown as FormEvent;
        handleSubmit(formEvent, files.length > 0 ? files : null);
        setFiles([]);
      }
    }
  };

  return (
    <motion.form
      onSubmit={(e) => {
        e.preventDefault();
        if (isLoading) {
          onStopGeneration();
        } else {
          handleSubmit(e, files.length > 0 ? files : null);
          setFiles([]);
        }
      }}
      className="flex flex-col w-full bg-white/80 dark:bg-blue-900/80 backdrop-blur-md rounded-2xl p-2 shadow-md border border-blue-100 dark:border-blue-800/50 mb-2 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {files.length > 0 && (
        <div className="absolute bottom-full mb-2 left-0 right-0 px-1 z-10">
          <MultiFilePreview files={files} onRemove={removeFile} />
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl text-blue-800 dark:text-blue-200 placeholder:text-blue-400 dark:placeholder:text-blue-500 min-h-[40px] max-h-[200px] resize-none overflow-y-auto"
            rows={1}
          />
        </div>

        {/* Only show upload button if model supports images, documents or audio */}
        {(selectedModel.capabilities.images ||
          selectedModel.capabilities.documents) && (
          <UploadButton
            onFile={addFile}
            maxFiles={MAX_FILES}
            currentCount={files.length}
            disabled={isLoading}
          />
        )}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            type="submit"
            disabled={isLoading ? false : !input.trim() && files.length === 0}
            className={`${
              isLoading
                ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            } transition-colors duration-300 rounded-xl h-10 w-10 p-0 text-white`}
          >
            {isLoading ? (
              <StopCircle className="h-4 w-4" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
            <span className="sr-only">{isLoading ? "Stop" : "Send"}</span>
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
