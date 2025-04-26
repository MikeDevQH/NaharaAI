"use client"
import { useConversation } from "@/contexts/conversation-context"
import { useModel } from "@/contexts/model-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon, PanelLeftClose } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"

interface SidebarProps {
  className?: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function Sidebar({ className, isOpen, setIsOpen }: SidebarProps) {
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewConversation,
    updateConversationTitle,
    deleteConversation,
  } = useConversation()
  const { selectedModel, setGeneratedTitle } = useModel()
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
    <>
      <div
        className={cn(
          "flex flex-col bg-gradient-to-br from-indigo-900/95 to-blue-950/90 backdrop-blur-md border-r border-blue-800 transition-all duration-300 fixed md:relative z-30 h-full",
          isOpen ? "w-72" : "w-0",
          className,
        )}
      >
        {isOpen && (
          <>
            {/* Sidebar header with logo and title */}
            <div className="p-4 border-b border-blue-800 bg-transparent text-white">
              <div className="flex items-center justify-between mb-4">
                <Link href="/" className="flex items-center gap-2">
                  <img src="/NaharaAI.png" alt="Nahara AI Logo" className="w-10 h-10 rounded-full" />
                  <span className="text-2xl font-bold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-300">
                    Nahara AI
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20 hover:text-white transition-all duration-300 "
                >
                  <PanelLeftClose className="h-5 w-5 scale-125" />
                </Button>
              </div>

              <h2 className="text-sm font-medium mb-3 uppercase tracking-wider opacity-80">Conversations</h2>
              <Button
                onClick={createNewConversation}
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-colors duration-300 shadow-sm rounded-xl"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Nuevo Chat
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
                        "group relative rounded-xl p-3 hover:bg-blue-800/30 transition-colors duration-200 border border-transparent",
                        currentConversation?.id === conversation.id ? "bg-blue-900/50 border-blue-700 shadow-sm" : "",
                      )}
                    >
                      {editingId === conversation.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 h-8 bg-blue-950/50 dark:bg-blue-900/50 rounded-xl text-white"
                            autoFocus
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-900/30 rounded-full"
                            onClick={() => saveTitle(conversation.id)}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-full"
                            onClick={cancelEditing}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="cursor-pointer" onClick={() => setCurrentConversation(conversation)}>
                          <div className="text-sm font-medium text-blue-300 truncate pr-16">{conversation.title}</div>
                          <div className="text-xs text-blue-400/70 mt-1">
                            {new Date(conversation.updatedAt).toLocaleDateString()} · {conversation.messages.length}{" "}
                            mensajes
                          </div>

                          <div className="absolute right-2 top-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-full"
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
                              className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-full"
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
                  <div className="text-center py-8 text-blue-400/70 italic">
                    There are no conversations with this model
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
