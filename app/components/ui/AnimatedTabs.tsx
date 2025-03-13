'use client'

import { useState, useEffect } from 'react'

interface AnimatedTabsProps {
  tabs: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'boxed';
  className?: string;
}

export default function AnimatedTabs({
  tabs,
  defaultTabId,
  onChange,
  variant = 'underline',
  className = ''
}: AnimatedTabsProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id || '')
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const [mounted, setMounted] = useState(false)
  
  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Update indicator position when active tab changes
  useEffect(() => {
    if (!mounted) return
    
    const activeTabElement = document.getElementById(`tab-${activeTabId}`)
    if (!activeTabElement) return
    
    if (variant === 'underline') {
      const { offsetLeft, offsetWidth } = activeTabElement
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`
      })
    }
  }, [activeTabId, mounted, variant])
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId)
    onChange?.(tabId)
  }
  
  // Base styles
  const baseStyles = 'flex items-center transition-all duration-300'
  
  // Variant styles
  const variantStyles = {
    underline: 'border-b border-gray-200 dark:border-gray-700',
    pills: 'gap-2',
    boxed: 'border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-gray-50 dark:bg-gray-800'
  }
  
  // Tab styles
  const getTabStyles = (isActive: boolean) => {
    switch (variant) {
      case 'underline':
        return `px-4 py-2 text-sm font-medium ${
          isActive 
            ? 'text-primary' 
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`
      case 'pills':
        return `px-4 py-2 text-sm font-medium rounded-full transition-colors ${
          isActive 
            ? 'bg-primary text-white shadow-md' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
        }`
      case 'boxed':
        return `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive 
            ? 'bg-white dark:bg-gray-700 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`
      default:
        return ''
    }
  }
  
  // Combined styles
  const tabsStyles = `${baseStyles} ${variantStyles[variant]} ${className}`
  
  return (
    <div className={tabsStyles}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          className={`relative flex items-center gap-2 ${getTabStyles(tab.id === activeTabId)}`}
          onClick={() => handleTabChange(tab.id)}
          type="button"
        >
          {tab.icon && <span className="text-lg">{tab.icon}</span>}
          <span>{tab.label}</span>
          
          {/* Glow effect for active pill */}
          {variant === 'pills' && tab.id === activeTabId && (
            <span className="absolute inset-0 rounded-full bg-primary opacity-20 blur-sm animate-pulse" />
          )}
        </button>
      ))}
      
      {/* Animated underline indicator */}
      {variant === 'underline' && (
        <div 
          className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 rounded-full"
          style={{
            ...indicatorStyle,
            transform: 'translateY(1px)'
          }}
        />
      )}
    </div>
  )
}
