"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MenuIcon, XIcon } from "lucide-react"
import { ConversationSidebar } from "./conversation-sidebar"
import { motion, AnimatePresence } from "framer-motion"

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed left-4 bottom-4 z-50 bg-blue-600 text-white hover:bg-blue-700 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 z-50 md:hidden p-4"
            >
              <div className="h-full relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 z-10 text-white hover:bg-blue-700/50"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="h-5 w-5" />
                </Button>
                <ConversationSidebar />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
