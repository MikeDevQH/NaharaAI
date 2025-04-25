"use client";

import { UserIcon, Copy, CheckIcon } from "lucide-react";
import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useModel } from "@/contexts/model-context";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className={cn(
        "flex items-start gap-3 mx-8",
        isUser
          ? "flex-row-reverse justify-start ml-auto max-w-[45%]"
          : "mr-auto max-w-[85%]"
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
              "text-xl font-bold",
              isUser
                ? "text-blue-700 dark:text-blue-300 text-right"
                : "text-blue-700 dark:text-blue-300"
            )}
          >
            {isUser ? "Tú" : "Nahara"}
          </div>
          <div
            className={cn(
              "p-3 rounded-2xl max-w-[90%]",
              isUser
                ? "bg-blue-100 dark:bg-blue-800/50 text-blue-950 dark:text-blue-100 inline-block float-right"
                : "text-blue-950 dark:text-blue-100"
            )}
          >
            {message.image &&
              message.image.base64 &&
              message.image.mimeType && (
                <img
                  src={`data:${message.image.mimeType};base64,${message.image.base64}`}
                  alt="User upload"
                  className="mb-2 rounded max-w-xs max-h-60 object-contain border border-blue-200 dark:border-blue-800 shadow"
                />
              )}
            {Array.isArray(message.images) && message.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {message.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`data:${img.mimeType};base64,${img.base64}`}
                    alt={`User upload ${idx + 1}`}
                    className="rounded max-w-xs max-h-60 object-contain border border-blue-200 dark:border-blue-800 shadow"
                  />
                ))}
              </div>
            )}

            {isUser ? (
              <p>{message.content}</p>
            ) : (
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
                      <div className="mb-4 border rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#0c1027]">
                        <div className="flex justify-between items-center px-4  bg-[#e8ecff] dark:bg-[#121E58] text-sm text-blue-800 dark:text-blue-100 font-medium border-b dark:border-blue-800">
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
                        <div className="overflow-auto">
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
                          }}
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
            )}
          </div>
        </div>

        {!isUser && (
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
