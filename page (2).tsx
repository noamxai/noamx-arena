'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function NewUser() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(session?.user?.name || '')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Here you would typically update the user profile in your database
      // For now, we'll just update the session
      await update({
        ...session,
        user: {
          ...session?.user,
          name,
        }
      })
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-primary">Welcome to NoamX Arena!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete your profile to get started
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Your Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                placeholder="Enter your name"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className="px-4 text-sm text-muted-foreground">Optional</div>
            <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
          </div>
          
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-foreground">
              Organization (Optional)
            </label>
            <div className="mt-1">
              <input
                id="organization"
                name="organization"
                type="text"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                placeholder="Your company or organization"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-foreground">
              Role (Optional)
            </label>
            <div className="mt-1">
              <input
                id="role"
                name="role"
                type="text"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                placeholder="Your job title or role"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors animate-pulse"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="text-sm text-primary hover:text-primary/90 focus:outline-none"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
