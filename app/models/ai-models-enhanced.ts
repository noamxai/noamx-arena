'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useApiKeyManager } from '@/app/lib/api-key-manager'

// Define the API integration endpoints
const aimlApiBaseUrl = 'https://api.aimlapi.com'
const googleApiBaseUrl = 'https://generativelanguage.googleapis.com'
const openaiApiBaseUrl = 'https://api.openai.com'
const anthropicApiBaseUrl = 'https://api.anthropic.com'
const huggingfaceApiBaseUrl = 'https://api-inference.huggingface.co'

// Define model interfaces
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  maxTokens?: number;
  apiType: 'aiml' | 'google' | 'openai' | 'anthropic' | 'huggingface';
  contextWindow?: number;
  pricingInfo?: string;
  releaseDate?: string;
  isAvailable: boolean;
}

// Enhanced list of available models with more details
export const availableModels: AIModel[] = [
  // OpenAI Models
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Advanced language model for a wide range of applications requiring high-quality text generation.',
    capabilities: ['text-generation', 'chat', 'code', 'reasoning'],
    maxTokens: 8192,
    apiType: 'openai',
    contextWindow: 8192,
    pricingInfo: 'Free credits for new users',
    releaseDate: '2023-03-14',
    isAvailable: true
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Optimized version of GPT-4 ideal for applications where response time is critical.',
    capabilities: ['text-generation', 'chat', 'code', 'reasoning'],
    maxTokens: 8192,
    apiType: 'openai',
    contextWindow: 128000,
    pricingInfo: 'Free credits for new users',
    releaseDate: '2023-11-06',
    isAvailable: true
  },
  {
    id: 'gpt-4-32k',
    name: 'GPT-4 32K',
    provider: 'OpenAI',
    description: 'Extended context version of GPT-4 for handling longer conversations and documents.',
    capabilities: ['text-generation', 'chat', 'code', 'reasoning', 'long-context'],
    maxTokens: 32768,
    apiType: 'openai',
    contextWindow: 32768,
    pricingInfo: 'Free credits for new users',
    releaseDate: '2023-06-13',
    isAvailable: true
  },
  
  // Anthropic Models
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Anthropic\'s most powerful model, with exceptional performance across language, reasoning, and coding tasks.',
    capabilities: ['text-generation', 'chat', 'reasoning', 'code', 'analysis'],
    maxTokens: 200000,
    apiType: 'anthropic',
    contextWindow: 200000,
    pricingInfo: 'Free tier available through AI/ML API',
    releaseDate: '2024-03-04',
    isAvailable: true
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced model offering strong performance with greater efficiency than Opus.',
    capabilities: ['text-generation', 'chat', 'reasoning'],
    maxTokens: 200000,
    apiType: 'anthropic',
    contextWindow: 200000,
    pricingInfo: 'Free tier available through AI/ML API',
    releaseDate: '2024-03-04',
    isAvailable: true
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Fast and cost-effective model for responsive applications and simpler tasks.',
    capabilities: ['text-generation', 'chat', 'summarization'],
    maxTokens: 200000,
    apiType: 'anthropic',
    contextWindow: 200000,
    pricingInfo: 'Free tier available through AI/ML API',
    releaseDate: '2024-03-04',
    isAvailable: true
  },
  
  // Meta Models
  {
    id: 'llama-3-1-8b',
    name: 'Llama 3.1 8B',
    provider: 'Meta',
    description: 'Optimized for advanced language generation tasks, excelling in multilingual applications.',
    capabilities: ['text-generation', 'chat', 'multilingual'],
    maxTokens: 8192,
    apiType: 'aiml',
    contextWindow: 8192,
    pricingInfo: 'Free through AI/ML API',
    releaseDate: '2024-07-23',
    isAvailable: true
  },
  {
    id: 'llama-3-1-70b',
    name: 'Llama 3.1 70B',
    provider: 'Meta',
    description: 'Enhanced zero-shot reasoning abilities with improved performance across tasks.',
    capabilities: ['text-generation', 'chat', 'reasoning', 'classification'],
    maxTokens: 8192,
    apiType: 'aiml',
    contextWindow: 8192,
    pricingInfo: 'Free through AI/ML API',
    releaseDate: '2024-07-23',
    isAvailable: true
  },
  {
    id: 'llama-3-1-405b',
    name: 'Llama 3.1 405B',
    provider: 'Meta',
    description: 'Largest Llama model for wide range of applications including content creation and customer support.',
    capabilities: ['text-generation', 'chat', 'reasoning', 'translation'],
    maxTokens: 8192,
    apiType: 'aiml',
    contextWindow: 8192,
    pricingInfo: 'Free through AI/ML API',
    releaseDate: '2024-07-23',
    isAvailable: true
  },
  
  // Google Models
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Fast, efficient model with low latency and enhanced performance.',
    capabilities: ['text-generation', 'chat', 'code'],
    maxTokens: 32768,
    apiType: 'google',
    contextWindow: 32768,
    pricingInfo: 'Free tier available',
    releaseDate: '2024-08-15',
    isAvailable: true
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: 'Versatile model with strong performance across text, code, and reasoning tasks.',
    capabilities: ['text-generation', 'chat', 'code', 'reasoning', 'long-context'],
    maxTokens: 1000000,
    apiType: 'google',
    contextWindow: 1000000,
    pricingInfo: 'Free tier available',
    releaseDate: '2024-02-15',
    isAvailable: true
  },
  
  // Other Models
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'DeepSeek',
    description: 'Specialized model for code generation and understanding.',
    capabilities: ['code', 'text-generation', 'reasoning'],
    maxTokens: 16384,
    apiType: 'aiml',
    contextWindow: 16384,
    pricingInfo: 'Free through AI/ML API',
    releaseDate: '2023-11-21',
    isAvailable: true
  },
  {
    id: 'flux-1-1',
    name: 'Flux 1.1',
    provider: 'Flux',
    description: 'Modern language model optimized for creative content generation.',
    capabilities: ['text-generation', 'chat', 'creative-writing'],
    maxTokens: 4096,
    apiType: 'aiml',
    contextWindow: 4096,
    pricingInfo: 'Free through AI/ML API',
    releaseDate: '2024-05-10',
    isAvailable: true
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    description: 'Powerful model with strong reasoning and instruction-following capabilities.',
    capabilities: ['text-generation', 'chat', 'reasoning', 'code'],
    maxTokens: 32768,
    apiType: 'aiml',
    contextWindow: 32768,
    pricingInfo: 'Free through AI/ML API',
    releaseDate: '2024-02-26',
    isAvailable: true
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: 'Mistral AI',
    description: 'Mixture-of-experts model with strong multilingual capabilities.',
    capabilities: ['text-generation', 'chat', 'multilingual'],
    maxTokens: 32768,
    apiType: 'aiml',
    contextWindow: 32768,
    pricingInfo: 'Free through AI/ML API',
    releaseDate: '2023-12-11',
    isAvailable: true
  }
];

// Interface for model response
export interface ModelResponse {
  model: string;
  text: string;
  tokensUsed?: number;
  processingTime?: number;
  error?: string;
}

// Function to query a model with automatic API key selection
export async function queryModel(
  modelId: string, 
  prompt: string, 
  options: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  } = {}
): Promise<ModelResponse> {
  try {
    const model = availableModels.find(m => m.id === modelId);
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }
    
    if (!model.isAvailable) {
      throw new Error(`Model ${modelId} is currently unavailable`);
    }
    
    const startTime = Date.now();
    
    // Get API key manager hook instance
    const { getApiKey, hasApiKey, generateDemoApiKey } = useApiKeyManagerInstance();
    
    // Check if API key is available for the model type
    const apiKeyProvider = model.apiType;
    let apiKey = '';
    
    if (hasApiKey(apiKeyProvider)) {
      apiKey = getApiKey(apiKeyProvider);
    } else {
      // Use demo key for testing if no key is available
      apiKey = generateDemoApiKey(apiKeyProvider);
    }
    
    // Different API handling based on the model type
    switch (model.apiType) {
      case 'aiml':
        const aimlResponse = await axios.post(
          `${aimlApiBaseUrl}/v1/chat/completions`,
          {
            model: modelId,
            messages: [{ role: 'user', content: prompt }],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1024,
            top_p: options.topP || 1
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        return {
          model: modelId,
          text: aimlResponse.data.choices[0].message.content,
          tokensUsed: aimlResponse.data.usage?.total_tokens,
          processingTime: Date.now() - startTime
        };
        
      case 'google':
        const googleResponse = await axios.post(
          `${googleApiBaseUrl}/v1beta/models/${modelId}:generateContent`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: options.temperature || 0.7,
              maxOutputTokens: options.maxTokens || 1024,
              topP: options.topP || 1
            }
          },
          {
            headers: {
              'x-goog-api-key': apiKey,
              'Content-Type': 'application/json'
            }
          }
        );
        
        return {
          model: modelId,
          text: googleResponse.data.candidates[0].content.parts[0].text,
          processingTime: Date.now() - startTime
        };
        
      case 'openai':
        const openaiResponse = await axios.post(
          `${openaiApiBaseUrl}/v1/chat/completions`,
          {
            model: modelId,
            messages: [{ role: 'user', content: prompt }],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1024,
            top_p: options.topP || 1
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        return {
          model: modelId,
          text: openaiResponse.data.choices[0].message.content,
          tokensUsed: openaiResponse.data.usage.total_tokens,
          processingTime: Date.now() - startTime
        };
        
      case 'anthropic':
        const anthropicResponse = await axios.post(
          `${anthropicApiBaseUrl}/v1/messages`,
          {
            model: modelId,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: options.maxTokens || 1024,
            temperature: options.temperature || 0.7,
            top_p: options.topP || 1
          },
          {
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json'
            }
          }
        );
        
        return {
          model: modelId,
          text: anthropicResponse.data.content[0].text,
          processingTime: Date.now() - startTime
        };
        
      case 'huggingface':
        const huggingfaceResponse = await axios.post(
          `${huggingfaceApiBaseUrl}/models/${modelId}`,
          {
            inputs: prompt,
            parameters: {
              temperature: options.temperature || 0.7,
              max_new_tokens: options.maxTokens || 1024,
              top_p: options.topP || 1
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        return {
          model: modelId,
          text: huggingfaceResponse.data[0].generated_text,
          processingTime: Date.now() - startTime
        };
        
      default:
        throw new Error(`Unsupported API type: ${model.apiType}`);
    }
  } catch (error) {
    console.error(`Error querying model ${modelId}:`, error);
    return {
      model: modelId,
      text: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to query multiple models simultaneously
export async function queryMultipleModels(
  modelIds: string[],
  prompt: string,
  options: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  } = {}
): Promise<ModelResponse[]> {
  const promises = modelIds.map(modelId => 
    queryModel(modelId, prompt, options)
  );
  
  return Promise.all(promises);
}

// Singleton instance of API key manager for use in non-component contexts
let apiKeyManagerInstance: ReturnType<typeof useApiKeyManager> | null = null;

function useApiKeyManagerInstance() {
  const [instance, setInstance] = useState<ReturnType<typeof useApiKeyManager> | null>(null);
  
  useEffect(() => {
    if (!apiKeyManagerInstance) {
      // This is a simplified version for non-component contexts
      apiKeyManagerInstance = {
        apiKeys: {},
        isLoading: false,
        error: null,
        setApiKey: () => {},
        removeApiKey: () => {},
        hasApiKey: () => false,
        getApiKey: () => '',
        detectApiKeyProvider: () => null,
        generateDemoApiKey: (provider) => {
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
      };
    }
    
    setInstance(apiKeyManagerInstance);
  }, []);
  
  return instance || {
    apiKeys: {},
    isLoading: false,
    error: null,
    setApiKey: () => {},
    removeApiKey: () => {},
    hasApiKey: () => false,
    getApiKey: () => '',
    detectApiKeyProvider: () => null,
    generateDemoApiKey: (provider) => {
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
  };
}

// Enhanced hook for model selection and querying with filtering capabilities
export function useAIModels() {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<ModelResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredModels, setFilteredModels] = useState<AIModel[]>(availableModels);
  const [filterCriteria, setFilterCriteria] = useState({
    provider: '',
    capability: '',
    contextSize: ''
  });
  
  // Filter models based on criteria
  const filterModels = (criteria: {
    provider?: string;
    capability?: string;
    contextSize?: string;
  }) => {
    let filtered = [...availableModels];
    
    if (criteria.provider) {
      filtered = filtered.filter(model => 
        model.provider.toLowerCase() === criteria.provider?.toLowerCase()
      );
    }
    
    if (criteria.capability) {
      filtered = filtered.filter(model => 
        model.capabilities.includes(criteria.capability as string)
      );
    }
    
    if (criteria.contextSize) {
      switch (criteria.contextSize) {
        case 'small':
          filtered = filtered.filter(model => (model.contextWindow || 0) <= 8192);
          break;
        case 'medium':
          filtered = filtered.filter(model => 
            (model.contextWindow || 0) > 8192 && (model.contextWindow || 0) <= 32768
          );
          break;
        case 'large':
          filtered = filtered.filter(model => (model.contextWindow || 0) > 32768);
          break;
      }
    }
    
    setFilteredModels(filtered);
    setFilterCriteria({
      ...filterCriteria,
      ...criteria
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilteredModels(availableModels);
    setFilterCriteria({
      provider: '',
      capability: '',
      contextSize: ''
    });
  };
  
  // Get unique providers
  const getUniqueProviders = () => {
    return [...new Set(availableModels.map(model => model.provider))];
  };
  
  // Get unique capabilities
  const getUniqueCapabilities = () => {
    const capabilities = new Set<string>();
    availableModels.forEach(model => {
      model.capabilities.forEach(capability => {
        capabilities.add(capability);
      });
    });
    return [...capabilities];
  };
  
  // Select model
  const selectModel = (modelId: string) => {
    if (!selectedModels.includes(modelId)) {
      setSelectedModels([...selectedModels, modelId]);
    }
  };
  
  // Deselect model
  const deselectModel = (modelId: string) => {
    setSelectedModels(selectedModels.filter(id => id !== modelId));
  };
  
  // Query selected models
  const querySelectedModels = async (
    prompt: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    } = {}
  ) => {
    if (selectedModels.length === 0) {
      setError('Please select at least one model');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await queryMultipleModels(
        selectedModels,
        prompt,
        options
      );
      
      setResponses(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    availableModels,
    filteredModels,
    selectedModels,
    responses,
    isLoading,
    error,
    filterCriteria,
    selectModel,
    deselectModel,
    querySelectedModels,
    filterModels,
    resetFilters,
    getUniqueProviders,
    getUniqueCapabilities
  };
}
