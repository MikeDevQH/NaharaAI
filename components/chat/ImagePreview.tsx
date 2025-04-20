"use client";
import { X } from "lucide-react";
import Image from "next/image";

export function ImagePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const url = URL.createObjectURL(file);
  return (
    <div className="relative inline-block mr-2 mb-2 border rounded shadow bg-white dark:bg-gray-900">
      <Image src={url} alt={file.name} width={96} height={96} className="rounded object-cover" />
      <button
        type="button"
        className="absolute top-1 right-1 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-900"
        onClick={onRemove}
      >
        <X size={16} />
      </button>
    </div>
  );
}
