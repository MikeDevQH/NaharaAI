import type { ChatImage } from "@/types/image";

export interface Message {
  images(images: any): unknown;
  id: string;
  content: string;
  role: "user" | "assistant";
  image?: ChatImage & { fileName?: string }
  files?: Array<ChatImage & { fileName?: string }>
}

