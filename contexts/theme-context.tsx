"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Function to get initial theme
const getInitialTheme = (): Theme => {
  // If we're on the client, try to read from localStorage
  if (typeof window !== "undefined") {
    // Check if there's a theme saved in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null

    // If there's a saved theme, use it
    if (savedTheme) {
      return savedTheme
    }

    // If no saved theme, use system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }
  }

  // Default to light theme
  return "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  // This effect runs only once when the component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only update the DOM if the component is mounted
    if (!mounted) return

    // Update the DOM when theme changes
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Save theme to localStorage
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  // Avoid flashing during hydration by returning null
  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
