'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    
    setCanvasDimensions()
    window.addEventListener('resize', setCanvasDimensions)
    
    // Animation variables
    let animationFrameId: number
    let particles: Particle[] = []
    const particleCount = 50
    const colors = [
      '#FF9933', // Orange
      '#FFD700', // Gold
      '#333333', // Black
      '#FFFFFF'  // White
    ]
    
    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      
      constructor() {
        this.x = Math.random() * canvas.offsetWidth
        this.y = Math.random() * canvas.offsetHeight
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.offsetWidth) {
          this.speedX = -this.speedX
        }
        
        if (this.y < 0 || this.y > canvas.offsetHeight) {
          this.speedY = -this.speedY
        }
      }
      
      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
    
    // Draw logo text
    const drawLogoText = () => {
      if (!ctx) return
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      gradient.addColorStop(0, '#FF9933')  // Orange
      gradient.addColorStop(0.5, '#FFD700') // Gold
      gradient.addColorStop(1, '#FF9933')  // Orange
      
      ctx.fillStyle = gradient
      ctx.font = 'bold 24px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('NoamX Arena', canvas.offsetWidth / 2, canvas.offsetHeight / 2)
      
      // Add glow effect
      ctx.shadowColor = '#FFD700'
      ctx.shadowBlur = 10
      ctx.fillText('NoamX Arena', canvas.offsetWidth / 2, canvas.offsetHeight / 2)
      ctx.shadowBlur = 0
    }
    
    // Connect particles with lines
    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            if (!ctx) return
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 153, 51, ${1 - distance / 100})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }
    
    // Animation loop
    const animate = () => {
      if (!ctx) return
      
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      connectParticles()
      drawLogoText()
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animate()
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full min-h-[120px]"
      style={{ background: 'transparent' }}
    />
  )
}
