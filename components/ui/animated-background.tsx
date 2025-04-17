"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/contexts/theme-context"

// AnimatedBackground component
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  // TODO: Add props interface
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles
    const particles: Particle[] = []
    const particleCount = 50

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      baseHue: number
      baseSaturation: number
      baseLightness: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5

        // Colors between blue and purple
        this.baseHue = Math.random() * 60 + 220 // Between 220 (blue) and 280 (purple)
        this.baseSaturation = Math.random() * 30 + 70 // Between 70% and 100%
        this.baseLightness = Math.random() * 20 + 70 // Between 70% and 90%

        this.updateColor(theme)
      }

      updateColor(theme: string) {
        // Adjust colors based on theme
        if (theme === "dark") {
          this.color = `hsla(${this.baseHue}, ${this.baseSaturation}%, ${this.baseLightness - 40}%, 0.7)`
        } else {
          this.color = `hsla(${this.baseHue}, ${this.baseSaturation}%, ${this.baseLightness}%, 0.7)`
        }
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce on edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Draw connections between particles
    function drawConnections() {
      if (!ctx) return
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const alpha = 0.1 * (1 - distance / 100)
            const connectionColor = theme === "dark" ? `rgba(100, 150, 255, ${alpha})` : `rgba(100, 150, 255, ${alpha})`

            ctx.beginPath()
            ctx.strokeStyle = connectionColor
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Update particle colors when theme changes
    function updateParticleColors() {
      particles.forEach((particle) => particle.updateColor(theme))
    }

    // Animation function
    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      drawConnections()
      requestAnimationFrame(animate)
    }

    updateParticleColors()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-blue-950 transition-colors duration-500"
    />
  )
}
