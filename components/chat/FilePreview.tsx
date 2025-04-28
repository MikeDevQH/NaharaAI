"use client"
import { X, FileText, Music } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function FilePreview({
  file,
  onRemove,
}: {
  file: File
  onRemove: () => void
}) {
  const isPdf = file.type === "application/pdf"
  const isAudio = file.type.startsWith("audio/")
  const isImage = file.type.startsWith("image/")
  const url = URL.createObjectURL(file)

  return (
    <div className="relative inline-block rounded-lg overflow-hidden shadow-sm border border-blue-200 dark:border-blue-700 w-16 h-16">
      {isPdf ? (
        <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span className="absolute bottom-0 left-0 right-0 bg-blue-600/80 dark:bg-blue-800/80 text-white text-[8px] py-0.5 text-center truncate">
            {file.name.length > 10 ? file.name.substring(0, 8) + "..." : file.name}
          </span>
        </div>
      ) : isAudio ? (
        <div className="w-full h-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
          <Music className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <span className="absolute bottom-0 left-0 right-0 bg-purple-600/80 dark:bg-purple-800/80 text-white text-[8px] py-0.5 text-center truncate">
            {file.name.length > 10 ? file.name.substring(0, 8) + "..." : file.name}
          </span>
        </div>
      ) : isImage ? (
        <Image
          src={url || "/placeholder.svg"}
          alt={file.name}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <FileText className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          <span className="absolute bottom-0 left-0 right-0 bg-gray-600/80 dark:bg-gray-800/80 text-white text-[8px] py-0.5 text-center truncate">
            {file.name.length > 10 ? file.name.substring(0, 8) + "..." : file.name}
          </span>
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 bg-white/80 dark:bg-gray-800/80 rounded-full p-0.5 h-4 w-4 hover:bg-red-100 dark:hover:bg-red-900"
        onClick={onRemove}
      >
        <X size={8} />
      </Button>
    </div>
  )
}

export function MultiFilePreview({
  files,
  onRemove,
}: {
  files: File[]
  onRemove: (index: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 bg-white/90 dark:bg-blue-950/90 p-2 rounded-lg shadow-md border border-blue-200 dark:border-blue-700 backdrop-blur-sm">
      {files.map((file, index) => {
        const isPdf = file.type === "application/pdf"
        const isAudio = file.type.startsWith("audio/")
        const isImage = file.type.startsWith("image/")
        const url = URL.createObjectURL(file)

        return (
          <div
            key={index}
            className="relative inline-block rounded-lg overflow-hidden shadow-sm border border-blue-200 dark:border-blue-700 w-16 h-16"
          >
            {isPdf ? (
              <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <span className="absolute bottom-0 left-0 right-0 bg-blue-600/80 dark:bg-blue-800/80 text-white text-[8px] py-0.5 text-center truncate">
                  {file.name.length > 10 ? file.name.substring(0, 8) + "..." : file.name}
                </span>
              </div>
            ) : isAudio ? (
              <div className="w-full h-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Music className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <span className="absolute bottom-0 left-0 right-0 bg-purple-600/80 dark:bg-purple-800/80 text-white text-[8px] py-0.5 text-center truncate">
                  {file.name.length > 10 ? file.name.substring(0, 8) + "..." : file.name}
                </span>
              </div>
            ) : isImage ? (
              <Image
                src={url || "/placeholder.svg"}
                alt={file.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                <span className="absolute bottom-0 left-0 right-0 bg-gray-600/80 dark:bg-gray-800/80 text-white text-[8px] py-0.5 text-center truncate">
                  {file.name.length > 10 ? file.name.substring(0, 8) + "..." : file.name}
                </span>
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 bg-white/80 dark:bg-gray-800/80 rounded-full p-0.5 h-4 w-4 hover:bg-red-100 dark:hover:bg-red-900"
              onClick={() => onRemove(index)}
            >
              <X size={8} />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
