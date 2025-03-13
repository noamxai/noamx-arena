'use client'

import { useState } from 'react'
import { useAIModels, AIModel, ModelResponse } from '@/app/models/ai-models'
import { useSession } from 'next-auth/react'

export default function ModelTestingInterface() {
  const { data: session } = useSession()
  const {
    availableModels,
    selectedModels,
    responses,
    isLoading,
    error,
    selectModel,
    deselectModel,
    querySelectedModels
  } = useAIModels()

  const [prompt, setPrompt] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1024)
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    await querySelectedModels(prompt, apiKey, {
      temperature,
      maxTokens
    })
  }

  const toggleModelSelection = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      deselectModel(modelId)
    } else {
      selectModel(modelId)
    }
  }

  const modelsByProvider = availableModels.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = []
    }
    acc[model.provider].push(model)
    return acc
  }, {} as Record<string, AIModel[]>)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in">NoamX Arena</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Model Selection Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-slide-up">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Select Models</h2>
          
          {Object.entries(modelsByProvider).map(([provider, models]) => (
            <div key={provider} className="mb-6">
              <h3 className="text-lg font-medium mb-2 text-secondary">{provider}</h3>
              <div className="space-y-2">
                {models.map(model => (
                  <div 
                    key={model.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedModels.includes(model.id)
                        ? 'bg-primary/10 border border-primary'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => toggleModelSelection(model.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{model.name}</h4>
                        <p className="text-sm text-muted-foreground">{model.description.substring(0, 60)}...</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${
                        selectedModels.includes(model.id) ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}></div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {model.capabilities.map(capability => (
                        <span 
                          key={capability} 
                          className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="text-sm text-primary hover:text-primary/90 focus:outline-none"
            >
              {showApiKeyInput ? 'Hide API Key' : 'Configure API Key'}
            </button>
            
            {showApiKeyInput && (
              <div className="mt-2">
                <label htmlFor="apiKey" className="block text-sm font-medium text-foreground">
                  API Key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                  placeholder="Enter your API key"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Testing Interface */}
        <div className="lg:col-span-2 space-y-8">
          {/* Prompt Input */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-slide-up">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Test Prompt</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-medium text-foreground mb-1">
                  Enter your prompt
                </label>
                <textarea
                  id="prompt"
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                  placeholder="Enter a prompt to test the selected AI models..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-foreground mb-1">
                    Temperature: {temperature}
                  </label>
                  <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="maxTokens" className="block text-sm font-medium text-foreground mb-1">
                    Max Tokens: {maxTokens}
                  </label>
                  <input
                    id="maxTokens"
                    type="range"
                    min="256"
                    max="4096"
                    step="256"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Short</span>
                    <span>Long</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {selectedModels.length} model{selectedModels.length !== 1 ? 's' : ''} selected
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || selectedModels.length === 0 || !prompt.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors animate-pulse"
                >
                  {isLoading ? 'Processing...' : 'Test Models'}
                </button>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-md text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>
          
          {/* Results Display */}
          {responses.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-slide-up">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Results</h2>
              
              <div className="space-y-6">
                {responses.map((response, index) => {
                  const model = availableModels.find(m => m.id === response.model);
                  return (
                    <div 
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-lg">
                          {model?.name || response.model}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {model?.provider}
                          </span>
                        </h3>
                        
                        {response.processingTime && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            {(response.processingTime / 1000).toFixed(2)}s
                          </span>
                        )}
                      </div>
                      
                      {response.error ? (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-md text-sm">
                          {response.error}
                        </div>
                      ) : (
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="whitespace-pre-wrap">{response.text}</p>
                        </div>
                      )}
                      
                      {response.tokensUsed && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Tokens used: {response.tokensUsed}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
