'use client'

import { useState } from 'react'
import { useApiKeyManager, ApiKeyStorage } from '@/app/lib/api-key-manager'

export default function ApiKeyManager() {
  const {
    apiKeys,
    isLoading,
    error,
    setApiKey,
    removeApiKey,
    hasApiKey,
    detectApiKeyProvider
  } = useApiKeyManager()

  const [newKey, setNewKey] = useState('')
  const [provider, setProvider] = useState<keyof ApiKeyStorage>('aiml')
  const [showKeys, setShowKeys] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Handle adding a new API key
  const handleAddKey = () => {
    if (!newKey) return
    
    // Auto-detect provider if not manually selected
    const detectedProvider = detectApiKeyProvider(newKey)
    const finalProvider = provider === 'aiml' && detectedProvider ? detectedProvider : provider
    
    setApiKey(finalProvider, newKey)
    setNewKey('')
    setSuccessMessage(`API key for ${finalProvider} added successfully!`)
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  // Handle removing an API key
  const handleRemoveKey = (keyProvider: keyof ApiKeyStorage) => {
    removeApiKey(keyProvider)
  }

  // Mask API key for display
  const maskApiKey = (key: string) => {
    if (!key) return ''
    if (key.length <= 8) return '••••••••'
    return `${key.substring(0, 4)}${'•'.repeat(key.length - 8)}${key.substring(key.length - 4)}`
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-pulse">
        <h2 className="text-2xl font-semibold mb-4 text-primary">API Key Management</h2>
        <p className="text-muted-foreground">Loading API keys...</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-primary">API Key Management</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md">
          {successMessage}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          <div className="flex-1">
            <label htmlFor="apiKey" className="block text-sm font-medium text-foreground mb-1">
              API Key
            </label>
            <input
              id="apiKey"
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
              placeholder="Enter your API key"
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <label htmlFor="provider" className="block text-sm font-medium text-foreground mb-1">
              Provider
            </label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value as keyof ApiKeyStorage)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
            >
              <option value="aiml">AI/ML API (Auto-detect)</option>
              <option value="openai">OpenAI</option>
              <option value="google">Google</option>
              <option value="anthropic">Anthropic</option>
              <option value="huggingface">Hugging Face</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleAddKey}
          disabled={!newKey}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add API Key
        </button>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Saved API Keys</h3>
          <button
            onClick={() => setShowKeys(!showKeys)}
            className="text-sm text-primary hover:text-primary/90 transition-colors"
          >
            {showKeys ? 'Hide Keys' : 'Show Keys'}
          </button>
        </div>
        
        {Object.keys(apiKeys).length === 0 ? (
          <p className="text-muted-foreground">No API keys saved yet.</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(apiKeys).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div>
                  <span className="font-medium capitalize">{key}: </span>
                  <span className="font-mono">{showKeys ? value : maskApiKey(value)}</span>
                </div>
                <button
                  onClick={() => handleRemoveKey(key as keyof ApiKeyStorage)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p className="mb-2">
          <strong>Note:</strong> Your API keys are stored securely in your browser&apos;s local storage and are never sent to our servers.
        </p>
        <p>
          Don&apos;t have an API key? You can use our demo keys for testing purposes, but they have limited functionality.
        </p>
      </div>
    </div>
  )
}
