'use client'

import { useEffect, useRef } from 'react'

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    setCanvasDimensions()
    window.addEventListener('resize', setCanvasDimensions)
    
    // Animation variables
    let animationFrameId: number
    const particles: Particle[] = []
    const particleCount = 100
    const colors = [
      'rgba(255, 153, 51, 0.3)', // Orange
      'rgba(255, 215, 0, 0.3)',  // Gold
      'rgba(51, 51, 51, 0.2)',   // Black
      'rgba(255, 255, 255, 0.3)' // White
    ]
    
    // Mouse position
    let mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 150
    }
    
    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x
      mouse.y = event.y
    })
    
    window.addEventListener('mouseout', () => {
      mouse.x = null
      mouse.y = null
    })
    
    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      baseX: number
      baseY: number
      density: number
      color: string
      
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random() * 30) + 1
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }
      
      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      }
      
      update() {
        // Check mouse position
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const forceDirectionX = dx / distance
          const forceDirectionY = dy / distance
          const maxDistance = mouse.radius
          const force = (maxDistance - distance) / maxDistance
          const directionX = forceDirectionX * force * this.density
          const directionY = forceDirectionY * force * this.density
          
          if (distance < mouse.radius) {
            this.x -= directionX
            this.y -= directionY
          } else {
            if (this.x !== this.baseX) {
              const dx = this.x - this.baseX
              this.x -= dx / 10
            }
            if (this.y !== this.baseY) {
              const dy = this.y - this.baseY
              this.y -= dy / 10
            }
          }
        } else {
          // Return to original position
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX
            this.x -= dx / 20
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY
            this.y -= dy / 20
          }
        }
      }
    }
    
    // Initialize particles
    function init() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }
    
    // Connect particles with lines
    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 120) {
            if (!ctx) return
            ctx.strokeStyle = `rgba(255, 153, 51, ${0.2 - distance/600})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }
    
    // Animation loop
    function animate() {
      if (!ctx) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }
      
      connect()
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    init()
    animate()
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions)
      window.removeEventListener('mousemove', (event) => {
        mouse.x = event.x
        mouse.y = event.y
      })
      window.removeEventListener('mouseout', () => {
        mouse.x = null
        mouse.y = null
      })
      cancelAnimationFrame(animationFrameId)
    }
  }, [])
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full -z-10"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
