'use client'

import Link from 'next/link'

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-primary">Check your email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A sign in link has been sent to your email address.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center">
            <div className="animate-bounce bg-white dark:bg-gray-800 p-4 rounded-full">
              <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Please check your email for a sign in link. If you don't see it, check your spam folder.
            </p>
          </div>
          
          <div className="pt-4">
            <Link 
              href="/auth/signin"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors animate-pulse"
            >
              Return to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
