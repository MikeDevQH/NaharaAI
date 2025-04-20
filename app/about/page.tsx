"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Github, Mail } from "lucide-react"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { Footer } from "@/components/ui/footer"
import { useEffect } from "react"

export default function AboutPage() {
  // Ensure theme is correctly applied when loading the page
  useEffect(() => {
    // Check theme saved in localStorage
    const savedTheme = localStorage.getItem("theme")

    // Apply theme to document
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />

      <main className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-xl p-6 border border-blue-200 dark:border-blue-900"
        >
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Nahara
            </Link>
          </div>

          <div className="prose prose-blue dark:prose-invert max-w-none">
            <div className="flex items-center justify-center mb-8">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <img
                  src="/NaharaAI-512x512.png"
                  alt="Nahara AI Logo"
                  className="w-32 h-32 rounded-2xl shadow-lg border-2 border-blue-300 dark:border-blue-700"
                />
              </motion.div>
            </div>

            <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">🌌 About Nahara</h1>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">🧠 What is Nahara?</h2>
              <p className="mb-4">
                Nahara is a conversational artificial intelligence designed to offer an accessible, intuitive, and fun
                experience in one place. The central idea of the project is to allow anyone to explore and converse with
                different AI models in a simple way, without technical complications or complex registrations.
              </p>
              <p className="mb-4">
                Whether you're here out of curiosity, to learn, experiment, or just have a good time, Nahara is ready to
                accompany you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                ✨ Why is it called Nahara?
              </h2>
              <p className="mb-4">
                The name Nahara is not casual: it comes from the fusion of several meanings that connect with the
                essence of the project. In Hebrew, nahar means river, representing the constant flow of ideas and
                knowledge. In the Bible, Nahara is associated with joy and energy, and in Arabic, it can be interpreted
                as light or clarity.
              </p>
              <p className="mb-4">
                Thus, Nahara is an AI with spark, with its own soul, that flows like water, illuminates like light, and
                accompanies you with curious and friendly energy. It doesn't just respond, it also connects.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">👨‍💻 Who's behind it?</h2>
              <p className="mb-4">
                The creator of this project is MikeDevQh — Michael Quevedo, a passionate coder and digital creator:
              </p>
              <blockquote className="border-l-4 border-blue-500 dark:border-blue-700 pl-4 italic mb-4">
                "Although I don't professionally dedicate myself to development, I enjoy learning, improving my skills,
                and building things for fun. Nahara was born from curiosity about working with artificial intelligence
                APIs and evolved into this small galactic universe you see here. It's a space that will continue to
                grow, like me, with each line of code and each new idea."
              </blockquote>
              <p className="mb-4">
                <strong>More about Mike:</strong>
              </p>
              <p className="flex items-center mb-4">
                <Github className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                <a
                  href="https://github.com/MikeDevQH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  GitHub — Projects made with love, constantly evolving.
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">🌱 Project Philosophy</h2>
              <p className="mb-4">
                Nahara's main goal is to bring artificial intelligence closer to more people, in a clear, accessible way
                with a friendly interface. The philosophy behind this app is:
              </p>
              <ul className="list-none space-y-3 mb-4">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">💬</span>
                  <span>Democratize access to advanced language technologies.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">✨</span>
                  <span>Create a safe and pleasant space to interact with AI.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">🚀</span>
                  <span>Continue learning and improving in community.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">🛠️</span>
                  <span>Use technology with a responsible, creative approach without technical barriers.</span>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">💬 What can you do here?</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Talk with an AI that has its own personality.</li>
                <li>Try different conversational models (like those from Gemini).</li>
                <li>Generate images with AI (and soon much more!).</li>
                <li>Get inspired, learn, create... and even have a laugh.</li>
              </ul>
              <p className="mb-4">All from a clear, carefully crafted interface with soul.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">🔧 How does it work?</h2>
              <p className="mb-4">
                Nahara uses language models like Gemini 1.5 and 2.0, and more will be added in the future. The platform
                is built with modern technologies like Next.js, React, TypeScript, and TailwindCSS, designed to be fast,
                adaptable, and visually attractive.
              </p>
              <p className="mb-4">In the near future, functions will also be integrated such as:</p>
              <ul className="list-none space-y-3 mb-4">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">🎨</span>
                  <span>Image generation with context</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">🎥</span>
                  <span>Support for video generation and multimedia AI</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">🎧</span>
                  <span>Voice interaction and audio processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">📸</span>
                  <span>Image interpretation and visual input</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">🛰️</span>
                  <span>And much more...</span>
                </li>
              </ul>
            </section>

            <section className="mb-4">
              <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">📬 Contact</h2>
              <p className="mb-4">Do you have a question, suggestion, or just want to say hello?</p>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                <a
                  href="mailto:contacto.nahara.ai@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  contacto.nahara.ai@gmail.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
