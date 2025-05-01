"use client";
import { PaperclipIcon } from "lucide-react";
import type React from "react";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useModel } from "@/contexts/model-context";
import { toast } from "@/components/ui/use-toast";

export function UploadButton({
  onFile,
  maxFiles = 3,
  currentCount = 0,
  disabled = false,
}: {
  onFile: (file: File) => void;
  maxFiles?: number;
  currentCount?: number;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isDisabled = disabled || currentCount >= maxFiles;
  const { selectedModel } = useModel();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convert FileList to array and process each file
      const fileArray = Array.from(files);

      // Determine how many files we can add without exceeding the limit
      const availableSlots = maxFiles - currentCount;
      const filesToAdd = fileArray.slice(0, availableSlots);

      // Check each file against model capabilities
      filesToAdd.forEach((file) => {
        const isImage = file.type.startsWith("image/");
        const isDocument = file.type === "application/pdf";
        const isAudio = file.type.startsWith("audio/");

        // Verify if the model supports this file type
        if (isImage && !selectedModel.capabilities.images) {
          toast({
            title: "Archivo no soportado",
            description: `El modelo ${selectedModel.name} no soporta imágenes`,
            variant: "destructive",
          });
          return;
        }

        if (isDocument && !selectedModel.capabilities.documents) {
          toast({
            title: "Archivo no soportado",
            description: `El modelo ${selectedModel.name} no soporta documentos PDF`,
            variant: "destructive",
          });
          return;
        }

        if (isAudio && !selectedModel.capabilities.audio) {
          toast({
            title: "Archivo no soportado",
            description: `El modelo ${selectedModel.name} no soporta archivos de audio`,
            variant: "destructive",
          });
          return;
        }

        // If we get here, the file is supported
        onFile(file);
      });

      // Reset input value so the same file can be selected again
      e.target.value = "";
    }
  };

  // Determine which file types to accept based on model capabilities
  const getAcceptedFileTypes = () => {
    const acceptedTypes = [];

    if (selectedModel.capabilities.images) {
      acceptedTypes.push(
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/heic",
        "image/heif"
      );
    }

    if (selectedModel.capabilities.documents) {
      acceptedTypes.push("application/pdf");
    }

    if (selectedModel.capabilities.audio) {
      acceptedTypes.push(
        "audio/mp3",
        "audio/wav",
        "audio/aac",
        "audio/ogg",
        "audio/flac",
        "audio/mpeg"
      );
    }

    return acceptedTypes.join(",");
  };

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
        title={
          isDisabled
            ? `Máximo ${maxFiles} archivos`
            : "Adjuntar archivo (imagen, documento o audio)"
        }
        disabled={isDisabled}
      >
        <PaperclipIcon size={18} />
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={getAcceptedFileTypes()}
        className="hidden"
        multiple
        onChange={handleFileSelect}
        disabled={isDisabled}
      />
    </>
  );
}
