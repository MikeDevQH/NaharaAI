"use client"
import { ImageIcon } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"

export function UploadButton({
  onFile,
  maxImages = 3,
  currentCount = 0,
}: {
  onFile: (file: File) => void
  maxImages?: number
  currentCount?: number
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const disabled = currentCount >= maxImages

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`rounded-xl h-10 w-10 p-0 ${
          disabled
            ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
            : "text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/50"
        }`}
        onClick={() => !disabled && inputRef.current?.click()}
        title={disabled ? `Máximo ${maxImages} imágenes` : "Adjuntar imagen"}
        disabled={disabled}
      >
        <ImageIcon size={18} />
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onFile(file)
            // Reset input value so the same file can be selected again
            e.target.value = ""
          }
        }}
      />
    </>
  )
}
