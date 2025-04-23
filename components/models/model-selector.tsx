"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useModel } from "@/contexts/model-context"
import { availableModels } from "@/lib/models"
import { useTheme } from "@/contexts/theme-context"

// Prop for triggering an external reset
interface ModelSelectorProps {
  onModelChange?: () => void
}

export function ModelSelector({ onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedModel, setSelectedModel } = useModel()
  const { theme } = useTheme()

  const handleModelChange = (modelId: string) => {
    if (modelId === selectedModel.id) {
      setIsOpen(false)
      return
    }

    setSelectedModel(modelId) // Update the global model
    setIsOpen(false)

    // Call resetChat if provided
    if (onModelChange) onModelChange()
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full md:w-48 ${
          theme === "light"
            ? "bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 border-blue-200 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-300 dark:border-blue-800"
            : "bg-gradient-to-r from-blue-900 to-indigo-900 text-blue-300 border-blue-800"
        } backdrop-blur-sm rounded-xl`}
      >
        <span className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {selectedModel.name}
        </span>
        <ChevronDown size={16} className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-10 w-full md:w-64 mt-1 rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
          >
            <div className="py-1">
              {availableModels.map((model) => (
                <motion.button
                  key={model.id}
                  onClick={() => handleModelChange(model.id)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-left text-sm hover:bg-blue-100 dark:hover:bg-blue-950",
                    selectedModel.id === model.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300",
                  )}
                >
                  <div className="flex-1">
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{model.description}</div>
                  </div>
                  {selectedModel.id === model.id && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
