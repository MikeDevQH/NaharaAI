"use client";

import { UserIcon, Copy, CheckIcon, FileText, Music } from "lucide-react";
import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useModel } from "@/contexts/model-context";
import ReactMarkdown from "react-markdown";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useTheme } from "@/contexts/theme-context";
import PrismNaharaDark from "@/styles/PrismNaharaDark";
import PrismNaharaLight from "@/styles/PrismNaharaLight";

interface ChatMessageProps {
  message: Message;
  index: number;
}

export default function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user";
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { selectedModel } = useModel();
  const iconAI = (
    <img
      src="/NaharaAI.png"
      alt="Nahara AI Logo"
      className="w-7 h-7 rounded-full "
    />
  );
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Helper function to render a file preview
  const renderFilePreview = (file: any, idx?: number) => {
    if (!file || !file.mimeType) return null;

    if (file.mimeType.startsWith("image/")) {
      return (
        <img
          key={idx}
          src={`data:${file.mimeType};base64,${file.base64}`}
          alt={file.fileName || "Image"}
          className="mb-2 rounded max-w-xs max-h-60 object-contain border border-blue-200 dark:border-blue-800 shadow"
        />
      );
    } else if (file.mimeType === "application/pdf") {
      return (
        <div
          key={idx}
          className="mb-2 p-3 bg-blue-200/50 dark:bg-blue-900/50 rounded-lg flex items-center gap-2 border border-blue-300 dark:border-blue-700"
        >
          <FileText className="h-8 w-8 text-blue-700 dark:text-blue-300" />
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200">
              {file.fileName || "Document.pdf"}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              PDF Document
            </p>
          </div>
        </div>
      );
    } else if (file.mimeType.startsWith("audio/")) {
      return (
        <div
          key={idx}
          className="mb-2 p-3 bg-purple-200/50 dark:bg-purple-900/50 rounded-lg border border-purple-300 dark:border-purple-700 w-full"
        >
          <div className="flex items-center gap-2 mb-2">
            <Music className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            <div>
              <p className="font-medium text-purple-800 dark:text-purple-200">
                {file.fileName || "Audio file"}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Audio
              </p>
            </div>
          </div>
          <audio
            src={`data:${file.mimeType};base64,${file.base64}`}
            controls
            className="w-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      );
    }
    return null;
  };

  // Modify the rendering to handle empty messages (when generation stops)
  return (
    <motion.div
      className={cn(
        "flex items-start gap-2 md:gap-3 mx-2",
        isUser
          ? "flex-row-reverse justify-end ml-auto max-w-[75%] md:max-w-[45%] md:ml-auto md:mr-28"
          : "mr-auto max-w-[85%] md:mx-8"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full shadow-sm",
          isUser
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-700 dark:from-blue-700 dark:to-blue-600 dark:border-blue-800"
            : "bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 border-blue-200 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-300 dark:border-blue-800"
        )}
      >
        {isUser ? <UserIcon size={18} /> : iconAI}
      </div>
      <div className="flex-1 relative group">
        <div className="space-y-2">
          <div
            className={cn(
              "text-base md:text-xl font-bold",
              isUser
                ? "text-blue-700 dark:text-blue-300 text-right"
                : "text-blue-700 dark:text-blue-300"
            )}
          >
            {isUser ? "Tú" : "Nahara"}
          </div>
          {/* Only render the message content if there is content or it is a user message */}
          {(isUser ||
            message.content ||
            (message.image && message.image.base64) ||
            (message.files && message.files.length > 0)) && (
            <div
              className={cn(
                "p-3 rounded-2xl max-w-[90%]",
                isUser
                  ? "bg-blue-100 dark:bg-blue-800/50 text-blue-950 dark:text-blue-100 inline-block float-right"
                  : "text-blue-950 dark:text-blue-100"
              )}
            >
              {/* Display single file if present */}
              {message.image && renderFilePreview(message.image)}

              {/* Display multiple files */}
              {Array.isArray(message.files) && message.files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {message.files.map((file, idx) =>
                    renderFilePreview(file, idx)
                  )}
                </div>
              )}

              {isUser ? (
                <p>{message.content}</p>
              ) : message.content ? (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");

                      const copyToClipboard = () => {
                        const codeText = String(children).replace(/\n$/, "");
                        navigator.clipboard.writeText(codeText);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      };

                      return !inline && match ? (
                        <div
                          className="mb-4 border rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#0c1027]"
                          style={{ maxWidth: "100%" }}
                        >
                          <div className="flex justify-between items-center px-4 bg-[#e8ecff] dark:bg-[#121E58] text-sm text-blue-800 dark:text-blue-100 font-medium border-b dark:border-blue-800">
                            <span className="capitalize">{match[1]}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={copyToClipboard}
                              className={cn(
                                "text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full",
                                copied && "text-green-600 dark:text-green-400"
                              )}
                            >
                              {copied ? (
                                <CheckIcon size={14} />
                              ) : (
                                <Copy size={14} />
                              )}
                            </Button>
                          </div>
                          <div className="overflow-x-auto w-full max-w-[300px] md:max-w-[1200px]">
                            <SyntaxHighlighter
                              style={
                                isDarkMode ? PrismNaharaDark : PrismNaharaLight
                              }
                              language={match[1]}
                              PreTag="div"
                              showLineNumbers
                              customStyle={{
                                fontFamily:
                                  "Cascadia Code, ui-monospace, monospace",
                                margin: 0,
                                background: "transparent",
                                padding: "1rem",
                                width: "100%",
                              }}
                              wrapLongLines={false}
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      ) : (
                        <code
                          className="bg-muted px-1 py-0.5 rounded text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : null}
            </div>
          )}
        </div>

        {!isUser && message.content && (
          <Button
            size="sm"
            variant="ghost"
            onClick={copyToClipboard}
            className={cn(
              "absolute -bottom-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full h-8 w-8 p-0",
              copied && "text-green-600 dark:text-green-400"
            )}
          >
            {/* NOTE: Button icon changes depending on whether the content has been copied */}
            {copied ? <CheckIcon size={14} /> : <Copy size={14} />}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
