import type { ChatImage } from "./image";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  image?: ChatImage;
}

