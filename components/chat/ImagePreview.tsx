"use client"
import { X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ImagePreview({
  file,
  onRemove,
}: {
  file: File
  onRemove: () => void
}) {
  const url = URL.createObjectURL(file)
  return (
    <div className="relative inline-block mr-2 mb-2 rounded-xl overflow-hidden shadow-sm">
      // NOTE: Preview image with file name as alt text, fallback to placeholder if URL is unavailable
      <Image src={url || "/placeholder.svg"} alt={file.name} width={96} height={96} className="object-cover" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 h-6 w-6 hover:bg-red-100 dark:hover:bg-red-900"
        onClick={onRemove}
      >
        <X size={12} />
      </Button>
    </div>
  )
}

export function MultiImagePreview({
  files,
  onRemove,
}: {
  files: File[]
  onRemove: (index: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {files.map((file, index) => {
        const url = URL.createObjectURL(file)
        return (
          <div key={index} className="relative inline-block rounded-xl overflow-hidden shadow-sm">
            <Image src={url || "/placeholder.svg"} alt={file.name} width={96} height={96} className="object-cover" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 h-6 w-6 hover:bg-red-100 dark:hover:bg-red-900"
              onClick={() => onRemove(index)}
            >
              <X size={12} />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
