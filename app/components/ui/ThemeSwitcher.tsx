'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { AnimatedButton } from '@/app/components/ui'

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  
  // After mounting, we can safely show the theme switcher
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Handle theme change with animation
  const toggleTheme = () => {
    setIsAnimating(true)
    
    setTimeout(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark')
      
      setTimeout(() => {
        setIsAnimating(false)
      }, 600)
    }, 300)
  }
  
  if (!mounted) return null
  
  return (
    <div className="relative">
      {/* Sun/Moon animation */}
      <AnimatedButton
        variant="ghost"
        onClick={toggleTheme}
        className="relative w-10 h-10 rounded-full"
      >
        <div className="relative">
          {/* Sun (visible in dark mode) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              theme === 'dark'
                ? 'opacity-100 transform rotate-0 scale-100'
                : 'opacity-0 transform rotate-90 scale-0'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          
          {/* Moon (visible in light mode) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              theme === 'light'
                ? 'opacity-100 transform rotate-0 scale-100'
                : 'opacity-0 transform -rotate-90 scale-0'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </div>
        </div>
      </AnimatedButton>
      
      {/* Flash animation when switching themes */}
      {isAnimating && (
        <div className="fixed inset-0 bg-white dark:bg-black z-50 animate-flash" />
      )}
    </div>
  )
}

// Add this to your globals.css
// @keyframes flash {
//   0% { opacity: 0; }
//   50% { opacity: 0.3; }
//   100% { opacity: 0; }
// }
// .animate-flash {
//   animation: flash 0.8s ease-out;
// }
