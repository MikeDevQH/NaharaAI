"use client"

import { SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FormEvent } from "react"
import { motion } from "framer-motion"
import { useState } from "react"
import { UploadButton } from "./UploadButton"
import { ImagePreview } from "./ImagePreview"

// TODO: Add props interface
interface ChatInputProps {
  input: string
  setInput: (input: string) => void
  handleSubmit: (e: FormEvent, imageFile?: File | null) => Promise<void>
  isLoading: boolean
}

export function ChatInput({ input, setInput, handleSubmit, isLoading }: ChatInputProps) {
  const [image, setImage] = useState<File | null>(null);

  return (
    <motion.form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit(e, image);
        setImage(null);
      }}
      className="flex w-full gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col flex-1 gap-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-900 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-all duration-300 shadow-sm"
        />
        {image && (
          <ImagePreview file={image} onRemove={() => setImage(null)} />
        )}
      </div>
      <UploadButton onFile={setImage} />
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          type="submit"
          disabled={isLoading || (!input.trim() && !image)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 shadow-md"
        >
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </motion.div>
    </motion.form>
  )
}
