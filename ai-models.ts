import { useState } from 'react';
import axios from 'axios';

// Define the API integration for AI/ML API
const aimlApiBaseUrl = 'https://api.aimlapi.com';

// Define model interfaces
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  maxTokens?: number;
  apiType: 'aiml' | 'google' | 'openai' | 'direct';
}

// List of available models
export const availableModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Advanced language model for a wide range of applications requiring high-quality text generation.',
    capabilities: ['text-generation', 'chat', 'code', 'reasoning'],
    maxTokens: 8192,
    apiType: 'aiml'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Optimized version of GPT-4 ideal for applications where response time is critical.',
    capabilities: ['text-generation', 'chat', 'code', 'reasoning'],
    maxTokens: 8192,
    apiType: 'aiml'
  },
  {
    id: 'claude',
    name: 'Claude',
    provider: 'Anthropic',
    description: 'Advanced AI assistant focused on helpfulness, harmlessness, and honesty.',
    capabilities: ['text-generation', 'chat', 'reasoning'],
    maxTokens: 100000,
    apiType: 'aiml'
  },
  {
    id: 'llama-3-1-8b',
    name: 'Llama 3.1 8B',
    provider: 'Meta',
    description: 'Optimized for advanced language generation tasks, excelling in multilingual applications.',
    capabilities: ['text-generation', 'chat', 'multilingual'],
    maxTokens: 8192,
    apiType: 'aiml'
  },
  {
    id: 'llama-3-1-70b',
    name: 'Llama 3.1 70B',
    provider: 'Meta',
    description: 'Enhanced zero-shot reasoning abilities with improved performance across tasks.',
    capabilities: ['text-generation', 'chat', 'reasoning', 'classification'],
    maxTokens: 8192,
    apiType: 'aiml'
  },
  {
    id: 'llama-3-1-405b',
    name: 'Llama 3.1 405B',
    provider: 'Meta',
    description: 'Largest Llama model for wide range of applications including content creation and customer support.',
    capabilities: ['text-generation', 'chat', 'reasoning', 'translation'],
    maxTokens: 8192,
    apiType: 'aiml'
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Fast, efficient model with low latency and enhanced performance.',
    capabilities: ['text-generation', 'chat', 'code'],
    apiType: 'google'
  },
  {
    id: 'deepseek',
    name: 'Deepseek',
    provider: 'Deepseek',
    description: 'Advanced language model with strong reasoning capabilities.',
    capabilities: ['text-generation', 'chat', 'reasoning'],
    apiType: 'aiml'
  },
  {
    id: 'flux-1-1',
    name: 'Flux 1.1',
    provider: 'Flux',
    description: 'Modern language model optimized for creative content generation.',
    capabilities: ['text-generation', 'chat', 'creative-writing'],
    apiType: 'aiml'
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

// Function to query a model
export async function queryModel(
  modelId: string, 
  prompt: string, 
  apiKey: string,
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
    
    const startTime = Date.now();
    
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
        // Placeholder for Google API integration
        // In a real implementation, this would use the Google AI Studio API
        return {
          model: modelId,
          text: `[Google ${model.name} response would appear here]`,
          processingTime: Date.now() - startTime
        };
        
      case 'openai':
        // Placeholder for direct OpenAI API integration
        return {
          model: modelId,
          text: `[OpenAI ${model.name} response would appear here]`,
          processingTime: Date.now() - startTime
        };
        
      case 'direct':
        // Placeholder for other direct API integrations
        return {
          model: modelId,
          text: `[${model.name} response would appear here]`,
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
  apiKey: string,
  options: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  } = {}
): Promise<ModelResponse[]> {
  const promises = modelIds.map(modelId => 
    queryModel(modelId, prompt, apiKey, options)
  );
  
  return Promise.all(promises);
}

// Hook for model selection and querying
export function useAIModels() {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<ModelResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const selectModel = (modelId: string) => {
    if (!selectedModels.includes(modelId)) {
      setSelectedModels([...selectedModels, modelId]);
    }
  };
  
  const deselectModel = (modelId: string) => {
    setSelectedModels(selectedModels.filter(id => id !== modelId));
  };
  
  const querySelectedModels = async (
    prompt: string, 
    apiKey: string,
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
        apiKey,
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
    selectedModels,
    responses,
    isLoading,
    error,
    selectModel,
    deselectModel,
    querySelectedModels
  };
}
