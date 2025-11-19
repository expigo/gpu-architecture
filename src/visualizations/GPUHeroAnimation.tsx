import { useEffect, useRef } from 'react'

export default function GPUHeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 600
    canvas.height = 400

    // Core data
    interface Core {
      x: number
      y: number
      active: boolean
      pulse: number
      type: 'cuda' | 'tensor'
    }

    const cores: Core[] = []
    const rows = 8
    const cols = 8
    const spacing = 60
    const startX = (canvas.width - cols * spacing) / 2
    const startY = (canvas.height - rows * spacing) / 2

    // Initialize cores
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        cores.push({
          x: startX + j * spacing,
          y: startY + i * spacing,
          active: Math.random() > 0.5,
          pulse: Math.random() * Math.PI * 2,
          type: Math.random() > 0.7 ? 'tensor' : 'cuda'
        })
      }
    }

    let animationFrame: number

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(26, 26, 26, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw cores
      cores.forEach(core => {
        const pulseValue = Math.sin(Date.now() * 0.002 + core.pulse) * 0.3 + 0.7
        const size = core.active ? 8 * pulseValue : 5

        // Core color
        const color = core.type === 'tensor'
          ? `rgba(0, 212, 170, ${core.active ? pulseValue : 0.3})`
          : `rgba(118, 185, 0, ${core.active ? pulseValue : 0.3})`

        // Draw core
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(core.x, core.y, size, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect for active cores
        if (core.active) {
          const gradient = ctx.createRadialGradient(
            core.x, core.y, size,
            core.x, core.y, size * 3
          )
          gradient.addColorStop(0, color)
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(core.x, core.y, size * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Draw connections between nearby active cores
      ctx.strokeStyle = 'rgba(118, 185, 0, 0.1)'
      ctx.lineWidth = 1
      for (let i = 0; i < cores.length; i++) {
        if (!cores[i].active) continue
        for (let j = i + 1; j < cores.length; j++) {
          if (!cores[j].active) continue
          const dist = Math.hypot(cores[i].x - cores[j].x, cores[i].y - cores[j].y)
          if (dist < 70) {
            const opacity = (70 - dist) / 70 * 0.3
            ctx.strokeStyle = `rgba(118, 185, 0, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(cores[i].x, cores[i].y)
            ctx.lineTo(cores[j].x, cores[j].y)
            ctx.stroke()
          }
        }
      }

      // Randomly toggle core states
      if (Math.random() > 0.98) {
        const randomCore = cores[Math.floor(Math.random() * cores.length)]
        randomCore.active = !randomCore.active
      }

      // Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '14px monospace'
      ctx.fillText('64 GPU Cores', 10, 25)
      ctx.fillText(`Active: ${cores.filter(c => c.active).length}`, 10, 45)

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return (
    <div className="w-full h-full bg-nvidia-dark rounded-xl shadow-2xl p-4">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '600px', maxHeight: '400px', margin: '0 auto', display: 'block' }}
      />
    </div>
  )
}
