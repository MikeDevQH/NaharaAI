"use client"
import { PaperclipIcon } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"

export function UploadButton({
  onFile,
  maxFiles = 3,
  currentCount = 0,
  disabled = false,
}: {
  onFile: (file: File) => void
  maxFiles?: number
  currentCount?: number
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isDisabled = disabled || currentCount >= maxFiles

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`rounded-xl h-10 w-10 p-0 ${
          isDisabled
            ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
            : "text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/50"
        }`}
        onClick={() => !isDisabled && inputRef.current?.click()}
        title={isDisabled ? `Maximum ${maxFiles} files` : "Attach file (image, document, or audio)"}
        disabled={isDisabled}
      >
        <PaperclipIcon size={18} />
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/heic,image/heif,application/pdf,audio/mp3,audio/wav,audio/aac,audio/ogg,audio/flac,audio/mpeg"
        className="hidden"
        multiple
        onChange={(e) => {
          const files = e.target.files
          if (files && files.length > 0) {
            // Convert FileList to array and process each file
            const fileArray = Array.from(files)

            // Determine how many files we can add without exceeding the limit
            const availableSlots = maxFiles - currentCount
            const filesToAdd = fileArray.slice(0, availableSlots)

            // Add each file
            filesToAdd.forEach((file) => onFile(file))

            // Reset input value so the same file can be selected again
            e.target.value = ""
          }
        }}
        disabled={isDisabled}
      />
    </>
  )
}
