/**
 * Integration tests for AI model API integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { queryModel, queryMultipleModels } from '@/app/models/ai-models-enhanced';
import { ApiCache } from '@/app/utils/performance';

// Mock Axios for API calls
vi.mock('axios', () => ({
  default: {
    post: vi.fn().mockImplementation((url) => {
      // Mock different responses based on the URL
      if (url.includes('aimlapi.com')) {
        return Promise.resolve({
          data: {
            choices: [{ message: { content: 'AIML API response' } }],
            usage: { total_tokens: 150 }
          }
        });
      } else if (url.includes('openai.com')) {
        return Promise.resolve({
          data: {
            choices: [{ message: { content: 'OpenAI response' } }],
            usage: { total_tokens: 200 }
          }
        });
      } else if (url.includes('anthropic.com')) {
        return Promise.resolve({
          data: {
            content: [{ text: 'Anthropic response' }]
          }
        });
      } else if (url.includes('generativelanguage.googleapis.com')) {
        return Promise.resolve({
          data: {
            candidates: [{ content: { parts: [{ text: 'Google response' }] } }]
          }
        });
      } else if (url.includes('huggingface.co')) {
        return Promise.resolve({
          data: [{ generated_text: 'Hugging Face response' }]
        });
      }
      
      return Promise.resolve({ data: {} });
    })
  }
}));

// Mock API key manager
vi.mock('@/app/lib/api-key-manager', () => ({
  useApiKeyManager: () => ({
    getApiKey: () => 'test-api-key',
    hasApiKey: () => true,
    generateDemoApiKey: () => 'demo-api-key'
  }),
  useApiKeyManagerInstance: () => ({
    getApiKey: () => 'test-api-key',
    hasApiKey: () => true,
    generateDemoApiKey: () => 'demo-api-key'
  })
}));

describe('AI Model API Integration', () => {
  beforeEach(() => {
    // Clear cache between tests
    ApiCache.clear();
    
    // Reset mocks
    vi.clearAllMocks();
  });
  
  describe('queryModel', () => {
    it('should query AIML API model and return response', async () => {
      const response = await queryModel('llama-3-1-8b', 'Test prompt', {
        temperature: 0.7,
        maxTokens: 100
      });
      
      expect(response.model).toBe('llama-3-1-8b');
      expect(response.text).toBe('AIML API response');
      expect(response.tokensUsed).toBe(150);
      expect(response.processingTime).toBeGreaterThan(0);
    });
    
    it('should query OpenAI model and return response', async () => {
      const response = await queryModel('gpt-4', 'Test prompt', {
        temperature: 0.7,
        maxTokens: 100
      });
      
      expect(response.model).toBe('gpt-4');
      expect(response.text).toBe('OpenAI response');
      expect(response.tokensUsed).toBe(200);
      expect(response.processingTime).toBeGreaterThan(0);
    });
    
    it('should query Anthropic model and return response', async () => {
      const response = await queryModel('claude-3-opus', 'Test prompt', {
        temperature: 0.7,
        maxTokens: 100
      });
      
      expect(response.model).toBe('claude-3-opus');
      expect(response.text).toBe('Anthropic response');
      expect(response.processingTime).toBeGreaterThan(0);
    });
    
    it('should query Google model and return response', async () => {
      const response = await queryModel('gemini-2-flash', 'Test prompt', {
        temperature: 0.7,
        maxTokens: 100
      });
      
      expect(response.model).toBe('gemini-2-flash');
      expect(response.text).toBe('Google response');
      expect(response.processingTime).toBeGreaterThan(0);
    });
    
    it('should return error for non-existent model', async () => {
      const response = await queryModel('non-existent-model', 'Test prompt');
      
      expect(response.model).toBe('non-existent-model');
      expect(response.text).toBe('');
      expect(response.error).toContain('not found');
    });
  });
  
  describe('queryMultipleModels', () => {
    it('should query multiple models and return all responses', async () => {
      const modelIds = ['gpt-4', 'claude-3-opus', 'gemini-2-flash'];
      const responses = await queryMultipleModels(modelIds, 'Test prompt', {
        temperature: 0.7,
        maxTokens: 100
      });
      
      expect(responses.length).toBe(3);
      
      const gpt4Response = responses.find(r => r.model === 'gpt-4');
      const claudeResponse = responses.find(r => r.model === 'claude-3-opus');
      const geminiResponse = responses.find(r => r.model === 'gemini-2-flash');
      
      expect(gpt4Response?.text).toBe('OpenAI response');
      expect(claudeResponse?.text).toBe('Anthropic response');
      expect(geminiResponse?.text).toBe('Google response');
    });
    
    it('should handle errors for individual models', async () => {
      // Mock axios to throw error for one model
      const axiosMock = require('axios').default;
      axiosMock.post.mockImplementationOnce(() => {
        throw new Error('API error');
      });
      
      const modelIds = ['gpt-4', 'claude-3-opus'];
      const responses = await queryMultipleModels(modelIds, 'Test prompt');
      
      expect(responses.length).toBe(2);
      
      const gpt4Response = responses.find(r => r.model === 'gpt-4');
      const claudeResponse = responses.find(r => r.model === 'claude-3-opus');
      
      expect(gpt4Response?.error).toBeDefined();
      expect(claudeResponse?.text).toBe('Anthropic response');
    });
  });
});
