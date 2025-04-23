"use client";

import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";

// Github link component
export function GithubLink() {
  const { theme } = useTheme();
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant="ghost"
        size="icon"
        asChild
        className={`rounded-full w-10 h-10 border-none ${
          theme === "light"
            ? "bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 border-blue-200 "
            : "bg-gradient-to-r from-blue-900 to-indigo-900 text-blue-300 border-blue-800 "
        }`}

         


      >
        <a
          href="https://github.com/MikeDevQH"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
        >
          <GithubIcon className="w-5 h-5" />
        </a>
      </Button>
    </motion.div>
  );
}
