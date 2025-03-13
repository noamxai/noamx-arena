'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = 'An unexpected error occurred'
  
  if (error === 'OAuthSignin') errorMessage = 'Error in OAuth sign in process'
  if (error === 'OAuthCallback') errorMessage = 'Error in OAuth callback'
  if (error === 'OAuthCreateAccount') errorMessage = 'Error creating OAuth account'
  if (error === 'EmailCreateAccount') errorMessage = 'Error creating email account'
  if (error === 'Callback') errorMessage = 'Error in callback'
  if (error === 'OAuthAccountNotLinked') errorMessage = 'Email already exists with different provider'
  if (error === 'EmailSignin') errorMessage = 'Error sending email sign in link'
  if (error === 'CredentialsSignin') errorMessage = 'Invalid credentials'
  if (error === 'SessionRequired') errorMessage = 'Please sign in to access this page'
  if (error === 'Default') errorMessage = 'Unable to sign in'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-destructive">Authentication Error</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We encountered a problem signing you in
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center">
            <div className="bg-destructive/10 p-4 rounded-full">
              <svg className="h-12 w-12 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-base font-medium text-destructive">
              {errorMessage}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please try again or use a different sign in method.
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
