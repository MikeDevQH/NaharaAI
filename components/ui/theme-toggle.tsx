"use client";

import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={`rounded-full w-10 h-10 border-none ${
          theme === "light"
            ? "bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 border-blue-200 "
            : "bg-gradient-to-r from-blue-900 to-indigo-900 text-blue-300 border-blue-800 "
        }`}
      >
        <div className="relative w-5 h-5">
          {theme === "light" ? (
            <motion.div
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
              <SunIcon className="w-10 h-10" />
            </motion.div>
          ) : (
            <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
              <MoonIcon className="w-5 h-5" />
            </motion.div>
          )}
        </div>
      </Button>
    </motion.div>
  );
}
