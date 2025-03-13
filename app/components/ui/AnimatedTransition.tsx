'use client'

import { useState, useEffect } from 'react'

interface AnimatedTransitionProps {
  children: React.ReactNode;
  show: boolean;
  type?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate';
  duration?: number;
  delay?: number;
  className?: string;
}

export default function AnimatedTransition({
  children,
  show,
  type = 'fade',
  duration = 300,
  delay = 0,
  className = ''
}: AnimatedTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show)
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    if (show) {
      setShouldRender(true)
      // Small delay to ensure DOM update before animation starts
      setTimeout(() => {
        setIsAnimating(true)
      }, 10)
    } else {
      setIsAnimating(false)
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration])
  
  if (!shouldRender) return null
  
  // Base styles
  const baseStyles = 'transition-all overflow-hidden'
  
  // Animation styles
  const getAnimationStyles = () => {
    const animationDuration = `${duration}ms`
    const animationDelay = delay ? `${delay}ms` : '0ms'
    
    const commonStyles = {
      transitionDuration: animationDuration,
      transitionDelay: animationDelay,
    }
    
    switch (type) {
      case 'fade':
        return {
          ...commonStyles,
          opacity: isAnimating ? 1 : 0,
        }
      case 'slide-up':
        return {
          ...commonStyles,
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
        }
      case 'slide-down':
        return {
          ...commonStyles,
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating ? 'translateY(0)' : 'translateY(-20px)',
        }
      case 'slide-left':
        return {
          ...commonStyles,
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating ? 'translateX(0)' : 'translateX(20px)',
        }
      case 'slide-right':
        return {
          ...commonStyles,
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating ? 'translateX(0)' : 'translateX(-20px)',
        }
      case 'scale':
        return {
          ...commonStyles,
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
        }
      case 'rotate':
        return {
          ...commonStyles,
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating ? 'rotate(0deg)' : 'rotate(-5deg)',
        }
      default:
        return {
          ...commonStyles,
          opacity: isAnimating ? 1 : 0,
        }
    }
  }
  
  // Combined styles
  const transitionStyles = `${baseStyles} ${className}`
  
  return (
    <div className={transitionStyles} style={getAnimationStyles()}>
      {children}
    </div>
  )
}
