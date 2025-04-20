"use client";

import Head from "next/head";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircleHeart, Star } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Nahara AI – Smart AI for Everyone</title>
        <meta
          name="description"
          content="Nahara AI is your personal, intelligent assistant. Experience fast, intuitive, and powerful conversations with AI."
        />
        <meta property="og:title" content="Nahara AI – Smart AI for Everyone" />
        <meta
          property="og:description"
          content="Experience Nahara, your friendly AI powered by cutting-edge technology. Perfect for code, questions, and creativity."
        />
        <meta property="og:image" content="/NaharaAI-Preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="relative min-h-screen flex flex-col scroll-smooth">
        <AnimatedBackground />
        <main className="relative z-10 flex-1 flex flex-col justify-between items-center px-6 py-10 text-black dark:text-white transition-colors duration-300">
          {/* HERO */}
          <motion.section
            className="text-center max-w-3xl mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/NaharaAI-Logo.png"
              alt="Nahara AI Logo"
              className="w-52 h-52 mx-auto mb-6 rounded-2xl border-2 border-blue-300 dark:border-blue-700 shadow-lg"
            />
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-lg">
              Power your experience with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-300 font-bold text-5xl">
                Nahara AI
              </span>
            </h1>
            <p className="text-lg text-blue-800 dark:text-blue-200">
              The intelligent assistant that adapts to you. Fast, intuitive, and
              always ready.
            </p>
            <Link href="/chat">
              <Button className="mt-6 px-6 py-3 text-lg rounded-2xl shadow-md bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600">
                Start Chat Now
              </Button>
            </Link>
          </motion.section>

          {/* FEATURES */}
          <motion.section
            id="features"
            className="grid md:grid-cols-4 gap-6 max-w-6xl mb-24 leading-relaxed"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {[
              "Instant responses",
              "Multilingual intelligence",
              "Code help and debug",
              "Multiple AI models",
            ].map((title, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="group relative p-6 rounded-2xl shadow-lg backdrop-blur-md text-center transition-transform duration-300 transform hover:scale-[1.05] overflow-hidden bg-blue-100 dark:bg-blue-900 bg-opacity-30 dark:bg-opacity-30"
              >
                {/* Colorful sweep effect */}
                <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 opacity-30 transform skew-x-[-20deg] group-hover:animate-sweep z-0 pointer-events-none" />

                <div className="relative z-10 hover:scale-[1.15] transition-transform duration-300">
                  <div className="flex justify-center mb-4 text-blue-600 dark:text-blue-300">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-white">
                    {title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* HOW IT WORKS */}
          <section className="text-center max-w-4xl mb-20">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-lg">
              How Nahara Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-blue-800 dark:text-blue-300 hover:">
              {[
                [
                  "1. Ask anything", 
                  "From questions to code – Nahara listens.",
                ],
                [
                  "2. Get instant replies",
                  "No waiting, no fluff. Just smart help.",
                ],
                [
                  "3. Explore + create",
                  "Build, learn, imagine – with Nahara by your side.",
                ],
              ].map(([title, desc], i) => (
                <div
                  key={i}
                  className="bg-white/10 p-4 rounded-xl shadow dark:bg-blue-900/20 hover:scale-110 transition-transform duration-300"
                >
                  <h3 className="text-xl dark:text-white text-black font-bold mb-2">{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="text-center max-w-4xl mb-20">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-lg">
              Loved by users
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                [
                  "“I use Nahara for work and study. It's become my go-to assistant.”",
                  "– María G.",
                ],
                [
                  "“Nahara makes problem-solving feel like a breeze. I never knew AI could be this helpful! ”",
                  "– Lucas T.",
                ],
              ].map(([quote, author], i) => (
                <div
                  key={i}
                  className="bg-blue-50 dark:bg-blue-950/40 p-6 rounded-xl text-left"
                >
                  <MessageCircleHeart className="text-blue-500 dark:text-blue-300 mb-2" />
                  <p className="italic mb-2">"{quote}"</p>
                  <p className="font-semibold text-blue-700 dark:text-blue-300">
                    {author}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ABOUT NAHARA */}
          <section className="text-center max-w-3xl mb-24">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-blue-600 drop-shadow-lg mb-6">
              🧠 What is Nahara?
            </h2>
            <p className="text-blue-800 dark:text-blue-300 text-lg leading-relaxed">
              Nahara is a conversational artificial intelligence designed to
              offer an accessible, intuitive, and fun experience in one place.
              The central idea of the project is to allow anyone to explore and
              converse with different AI models in a simple way, without
              technical complications or complex registrations.
            </p>
            <p className="mt-4 text-blue-800 dark:text-blue-300 text-lg leading-relaxed">
              Whether you're here out of curiosity, to learn, experiment, or
              just have a good time, Nahara is ready to accompany you.
            </p>
          </section>

          {/* FINAL CTA */}
          <motion.section
            className="text-center max-w-xl mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 drop-shadow-lg">
              Ready to start?
            </h2>
            <p className="text-blue-700 dark:text-blue-300 mb-6 text-lg">
              Let Nahara assist you in everything you do.
            </p>
            <Link href="/chat">
              <Button className="px-6 py-3 text-lg rounded-2xl shadow-md bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                Launch Chat
              </Button>
            </Link>
          </motion.section>
        </main>
        <Footer />
      </div>
    </>
  );
}
