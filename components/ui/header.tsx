"use client"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { GithubLink } from "@/components/ui/github-link"
import { ModelSelector } from "@/components/models/model-selector"
import { PanelLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Header props
interface HeaderProps {
  onReset: () => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

// Modify Header component
export function Header({ onReset, isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white py-2 px-6 shadow-md z-10 relative dark:from-blue-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isSidebarOpen && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="mr-3 h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <PanelLeftIcon className="h-5 w-5" />
              </Button>
              <Link href="/" className="flex items-center gap-2">
                <img src="/NaharaAI.png" alt="Nahara AI Logo" className="w-8 h-8 rounded-full" />
                <span className="text-lg font-semibold text-white">Nahara AI</span>
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ModelSelector onModelChange={onReset} />
          <ThemeToggle />
          <GithubLink />
        </div>
      </div>
    </header>
  )
}
