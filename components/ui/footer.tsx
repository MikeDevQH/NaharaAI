"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GithubIcon, Mail, Heart, Star, Info, FileText } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [theme, setTheme] = useState<string>("light");

  // Detect current theme
  useEffect(() => {
    const checkTheme = () => {
      if (document.documentElement.classList.contains("dark")) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    };

    // Check initially
    checkTheme();

    // Set up a mutation observer to detect changes to the 'dark' class
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer
      className={`w-full bg-gradient-to-r from-blue-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-md text-white py-1 px-2 md:px-4 shadow-md z-50 border-t border-blue-800/30 fixed bottom-0 left-0 right-0 h-8`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Logo and copyright */}
          <div className="flex items-center space-x-2">
            <img
              src="/NaharaAI.png"
              alt="Logo Nahara AI"
              className="w-4 h-4 rounded-full"
            />
            <p className="font-medium">© {currentYear} Nahara AI</p>
          </div>

          {/* Central links */}
          <div className="flex flex-wrap justify-center gap-1 md:gap-3">
            <Link
              href="https://github.com/MikeDevQH/NaharaAI-Chat.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-blue-200 transition-colors duration-200"
            >
              <GithubIcon className="h-3 w-3 mr-1" />
              <span>GitHub</span>
            </Link>
            <a
              href="mailto:contacto.nahara.ai@gmail.com"
              className="flex items-center hover:text-blue-200 transition-colors duration-200"
            >
              <Mail className="h-3 w-3 mr-1" />
              <span>Contact</span>
            </a>
            <Link
              href="/terms"
              className="flex items-center hover:text-blue-200 transition-colors duration-200"
            >
              <FileText className="h-3 w-3 mr-1" />
              <span>Terms</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center hover:text-blue-200 transition-colors duration-200"
            >
              <Info className="h-3 w-3 mr-1" />
              <span>About</span>
            </Link>
          </div>

          {/* Creative phrase and easter egg */}
          <motion.p
            className="hidden sm:flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowEasterEgg(!showEasterEgg)}
          >
            <span className="text-blue-200">Thank you for using Nahara</span>
            <motion.span
              animate={{
                rotate: showEasterEgg ? [0, 15, -15, 15, 0] : 0,
                scale: showEasterEgg ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
              className="ml-1 inline-flex"
            >
              {showEasterEgg ? (
                <Heart className="h-3 w-3 text-pink-400" />
              ) : (
                <Star className="h-3 w-3 text-yellow-300" />
              )}
            </motion.span>
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
