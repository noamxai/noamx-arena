'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Interface for API key storage
export interface ApiKeyStorage {
  aiml?: string;
  openai?: string;
  google?: string;
  anthropic?: string;
  huggingface?: string;
}

// Interface for API key management
export interface ApiKeyManager {
  apiKeys: ApiKeyStorage;
  isLoading: boolean;
  error: string | null;
  setApiKey: (provider: keyof ApiKeyStorage, key: string) => void;
  removeApiKey: (provider: keyof ApiKeyStorage) => void;
  hasApiKey: (provider: keyof ApiKeyStorage) => boolean;
  getApiKey: (provider: keyof ApiKeyStorage) => string;
  detectApiKeyProvider: (key: string) => keyof ApiKeyStorage | null;
}

// Hook for API key management
export function useApiKeyManager(): ApiKeyManager {
  const { data: session } = useSession();
  const [apiKeys, setApiKeys] = useState<ApiKeyStorage>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load API keys from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user) {
      try {
        const userId = session.user.id || session.user.email;
        const storedKeys = localStorage.getItem(`noamx-api-keys-${userId}`);
        
        if (storedKeys) {
          setApiKeys(JSON.parse(storedKeys));
        }
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load API keys from storage');
        setIsLoading(false);
      }
    }
  }, [session]);

  // Save API keys to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user && !isLoading) {
      try {
        const userId = session.user.id || session.user.email;
        localStorage.setItem(`noamx-api-keys-${userId}`, JSON.stringify(apiKeys));
      } catch (err) {
        setError('Failed to save API keys to storage');
      }
    }
  }, [apiKeys, session, isLoading]);

  // Set an API key for a specific provider
  const setApiKey = (provider: keyof ApiKeyStorage, key: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: key
    }));
    setError(null);
  };

  // Remove an API key for a specific provider
  const removeApiKey = (provider: keyof ApiKeyStorage) => {
    setApiKeys(prev => {
      const newKeys = { ...prev };
      delete newKeys[provider];
      return newKeys;
    });
  };

  // Check if an API key exists for a specific provider
  const hasApiKey = (provider: keyof ApiKeyStorage): boolean => {
    return !!apiKeys[provider];
  };

  // Get an API key for a specific provider
  const getApiKey = (provider: keyof ApiKeyStorage): string => {
    return apiKeys[provider] || '';
  };

  // Detect the provider based on API key format
  const detectApiKeyProvider = (key: string): keyof ApiKeyStorage | null => {
    if (!key) return null;
    
    // OpenAI API keys typically start with "sk-"
    if (key.startsWith('sk-')) {
      return 'openai';
    }
    
    // Google API keys are typically 39 characters
    if (key.length === 39) {
      return 'google';
    }
    
    // Anthropic API keys typically start with "sk-ant-"
    if (key.startsWith('sk-ant-')) {
      return 'anthropic';
    }
    
    // Hugging Face API keys typically start with "hf_"
    if (key.startsWith('hf_')) {
      return 'huggingface';
    }
    
    // Default to AIML API if no specific format is detected
    return 'aiml';
  };

  return {
    apiKeys,
    isLoading,
    error,
    setApiKey,
    removeApiKey,
    hasApiKey,
    getApiKey,
    detectApiKeyProvider
  };
}

// Function to automatically generate a demo API key for testing
export function generateDemoApiKey(provider: keyof ApiKeyStorage): string {
  switch (provider) {
    case 'openai':
      return 'sk-demo-openai-key-for-testing-purposes-only';
    case 'google':
      return 'demo-google-api-key-for-testing-purposes';
    case 'anthropic':
      return 'sk-ant-demo-anthropic-key-for-testing';
    case 'huggingface':
      return 'hf_demo-huggingface-key-for-testing';
    case 'aiml':
    default:
      return 'demo-aiml-api-key-for-testing-purposes-only';
  }
}
