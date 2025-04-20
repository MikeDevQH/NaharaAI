"use client"

import { useState } from "react"
import { useConversation } from "@/contexts/conversation-context"
import { useModel } from "@/contexts/model-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function ConversationSidebar() {
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewConversation,
    updateConversationTitle,
    deleteConversation,
  } = useConversation()
  const { selectedModel, generatedTitle, setGeneratedTitle } = useModel()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  // Filter conversations by selected model
  const filteredConversations = conversations
    .filter((conv) => conv.modelId === selectedModel.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id)
    setEditTitle(currentTitle)
  }

  const saveTitle = (id: string) => {
    if (editTitle.trim()) {
      updateConversationTitle(id, editTitle.trim())

      // If we're editing the current conversation, also update the title in the model context
      if (currentConversation && currentConversation.id === id) {
        setGeneratedTitle(editTitle.trim())
      }
    }
    setEditingId(null)
  }

  const cancelEditing = () => {
    setEditingId(null)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white/90 to-blue-50/95 dark:from-gray-900/95 dark:to-blue-950/90 backdrop-blur-md border border-blue-200 dark:border-blue-900 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
      <div className="p-4 border-b border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-900 dark:to-indigo-800 text-white">
        <h2 className="text-lg font-semibold mb-3 flex justify-center">Conversations</h2>
        <Button
          onClick={createNewConversation}
          className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-colors duration-300 shadow-md"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-custom p-3 space-y-2">
        <AnimatePresence>
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "group relative rounded-md p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 border border-transparent",
                  currentConversation?.id === conversation.id
                    ? "bg-blue-100/80 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 shadow-sm"
                    : "",
                )}
              >
                {editingId === conversation.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 h-8 bg-white dark:bg-gray-700"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
                      onClick={() => saveTitle(conversation.id)}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={cancelEditing}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="cursor-pointer" onClick={() => setCurrentConversation(conversation)}>
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-300 truncate pr-16">
                      {conversation.title}
                    </div>
                    <div className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                      {new Date(conversation.updatedAt).toLocaleDateString()} · {conversation.messages.length} messages
                    </div>

                    <div className="absolute right-2 top-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditing(conversation.id, conversation.title)
                        }}
                      >
                        <EditIcon className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conversation.id)
                        }}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-blue-600/70 dark:text-blue-400/70 italic">
              No conversations with this model
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
