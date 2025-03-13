'use client'

import { useState, useRef, useEffect } from 'react'

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'tilt' | 'glow' | 'scale' | 'none';
}

export default function AnimatedCard({
  children,
  className = '',
  hoverEffect = 'tilt'
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  // Base styles
  const baseStyles = 'bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden transition-all duration-300'
  
  // Combined styles
  const cardStyles = `${baseStyles} ${className}`
  
  // Handle mouse move for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || hoverEffect !== 'tilt') return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    
    setRotation({ x: rotateX, y: rotateY })
    setPosition({ x, y })
  }
  
  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
  }
  
  // Apply entrance animation
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.opacity = '0'
      cardRef.current.style.transform = 'translateY(20px)'
      
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.opacity = '1'
          cardRef.current.style.transform = 'translateY(0)'
        }
      }, 100)
    }
  }, [])
  
  return (
    <div
      ref={cardRef}
      className={cardStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered && hoverEffect === 'tilt' 
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` 
          : isHovered && hoverEffect === 'scale'
          ? 'scale(1.02)'
          : 'perspective(1000px) rotateX(0) rotateY(0)',
        transition: 'all 0.3s ease',
        boxShadow: isHovered && hoverEffect === 'glow'
          ? '0 0 20px rgba(255, 153, 51, 0.5), 0 0 30px rgba(255, 215, 0, 0.3)'
          : ''
      }}
    >
      {/* Glow effect */}
      {isHovered && hoverEffect === 'glow' && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-300/20 rounded-xl animate-pulse"
          style={{ 
            filter: 'blur(15px)',
            zIndex: -1
          }}
        />
      )}
      
      {/* Spotlight effect for tilt */}
      {isHovered && hoverEffect === 'tilt' && (
        <div 
          className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent rounded-xl"
          style={{ 
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.2) 0%, transparent 70%)`,
            mixBlendMode: 'overlay'
          }}
        />
      )}
      
      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
