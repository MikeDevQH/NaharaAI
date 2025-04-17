"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useModel } from "@/contexts/model-context"
import { availableModels } from "@/lib/models"

// ModelSelector component
export function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedModel, setSelectedModel } = useModel()

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-56 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 hover:bg-white/30 dark:hover:bg-gray-800/30"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 w-full md:w-72 mt-1 rounded-md border border-blue-200 dark:border-blue-900 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
          >
            <div className="py-1">
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30",
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
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
