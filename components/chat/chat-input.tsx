"use client"

import { SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FormEvent } from "react"
import { motion } from "framer-motion"
import { useState } from "react"
import { UploadButton } from "./UploadButton"
import { MultiImagePreview } from "./ImagePreview"

interface ChatInputProps {
  input: string
  setInput: (input: string) => void
  handleSubmit: (e: FormEvent, imageFiles?: File[] | null) => Promise<void>
  isLoading: boolean
}

// NOTE: Maximum number of images allowed per message
const MAX_IMAGES = 3

export function ChatInput({ input, setInput, handleSubmit, isLoading }: ChatInputProps) {
  const [images, setImages] = useState<File[]>([])

  // NOTE: Adds an image if under limit
  const addImage = (file: File) => {
    if (images.length < MAX_IMAGES) {
      setImages((prev) => [...prev, file])
    }
    // WARNING: Exceeding the image limit will silently do nothing
  }

  // NOTE: Removes image by index from the images array
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <motion.form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(e, images.length > 0 ? images : null)
        setImages([])
      }}
      className="flex w-full gap-2 bg-white/30 dark:bg-blue-900/30 rounded-2xl p-2 shadow-sm border border-blue-100 dark:border-blue-800/50 mb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col flex-1 gap-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl text-blue-800 dark:text-blue-200 placeholder:text-blue-400 dark:placeholder:text-blue-500"
        />
        {images.length > 0 && <MultiImagePreview files={images} onRemove={removeImage} />}
      </div>

      <UploadButton onFile={addImage} maxImages={MAX_IMAGES} currentCount={images.length} />

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          type="submit"
          disabled={isLoading || (!input.trim() && images.length === 0)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 rounded-xl h-10 w-10 p-0 text-white"
        >
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </motion.div>
    </motion.form>
  )
}
