import { sanitize } from 'isomorphic-dompurify';

// Function to sanitize user input to prevent XSS attacks
export function sanitizeInput(input: string): string {
  return sanitize(input);
}

// Function to validate and sanitize API keys
export function validateApiKey(apiKey: string): boolean {
  // Remove any whitespace
  const trimmedKey = apiKey.trim();
  
  // Check if key meets minimum length requirement
  if (trimmedKey.length < 32) {
    return false;
  }
  
  // Check if key contains only valid characters
  const validKeyRegex = /^[A-Za-z0-9_-]+$/;
  if (!validKeyRegex.test(trimmedKey)) {
    return false;
  }
  
  return true;
}

// Function to securely store API keys (client-side)
export function securelyStoreApiKey(key: string, provider: string): void {
  if (!validateApiKey(key)) {
    throw new Error('Invalid API key format');
  }
  
  // In a real implementation, you might want to encrypt the key before storing
  // For this demo, we'll store it in localStorage with a prefix
  try {
    localStorage.setItem(`noamx_api_key_${provider}`, key);
  } catch (error) {
    console.error('Failed to store API key:', error);
    throw new Error('Failed to securely store API key');
  }
}

// Function to retrieve stored API keys
export function getStoredApiKey(provider: string): string | null {
  try {
    return localStorage.getItem(`noamx_api_key_${provider}`);
  } catch (error) {
    console.error('Failed to retrieve API key:', error);
    return null;
  }
}

// Function to validate email addresses
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Function to escape SQL queries to prevent SQL injection
export function escapeSql(input: string): string {
  // Replace single quotes with two single quotes to escape them
  return input.replace(/'/g, "''");
}

// Function to generate a CSRF token
export function generateCsrfToken(): string {
  // Generate a random string for CSRF token
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Function to validate URLs
export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (error) {
    return false;
  }
}
