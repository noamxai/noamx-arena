/**
 * Unit tests for security utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  generateSecureToken,
  sanitizeHtml,
  validateInput,
  verifyPassword,
  hashPassword,
  detectAttackPatterns
} from '@/app/utils/security';
import { z } from 'zod';

// Mock NextRequest for testing
const createMockRequest = (url: string, headers: Record<string, string> = {}) => {
  return {
    nextUrl: { toString: () => url },
    headers: {
      get: (name: string) => headers[name] || null
    },
    ip: '127.0.0.1'
  } as any;
};

describe('Security Utilities', () => {
  describe('generateSecureToken', () => {
    it('should generate a token of the specified length', () => {
      const token = generateSecureToken(16);
      // Each byte becomes 2 hex characters
      expect(token.length).toBe(32);
    });

    it('should generate different tokens on each call', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('sanitizeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const sanitized = sanitizeHtml(input);
      expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });

    it('should handle strings with no special characters', () => {
      const input = 'Normal text without special characters';
      const sanitized = sanitizeHtml(input);
      expect(sanitized).toBe(input);
    });
  });

  describe('validateInput', () => {
    it('should validate correct input against schema', () => {
      const schema = z.object({
        name: z.string().min(3),
        age: z.number().min(18)
      });
      
      const input = { name: 'John', age: 25 };
      const result = validateInput(input, schema);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(input);
      }
    });

    it('should reject invalid input', () => {
      const schema = z.object({
        name: z.string().min(3),
        age: z.number().min(18)
      });
      
      const input = { name: 'Jo', age: 16 };
      const result = validateInput(input, schema);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('name');
        expect(result.error).toContain('age');
      }
    });
  });

  describe('password hashing and verification', () => {
    it('should hash password and verify it correctly', async () => {
      const password = 'securePassword123';
      const hashedPassword = await hashPassword(password);
      
      // Hash should be different from original password
      expect(hashedPassword).not.toBe(password);
      
      // Should verify correctly
      const isValid = await verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'securePassword123';
      const wrongPassword = 'wrongPassword123';
      const hashedPassword = await hashPassword(password);
      
      const isValid = await verifyPassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('detectAttackPatterns', () => {
    it('should detect SQL injection attempts', () => {
      const sqlInjectionUrl = 'https://example.com/search?q=1%27%20OR%20%271%27=%271';
      const request = createMockRequest(sqlInjectionUrl);
      
      const result = detectAttackPatterns(request);
      expect(result.isSuspicious).toBe(true);
      expect(result.reason).toContain('SQL injection');
    });

    it('should detect XSS attempts', () => {
      const xssUrl = 'https://example.com/search?q=<script>alert("XSS")</script>';
      const request = createMockRequest(xssUrl);
      
      const result = detectAttackPatterns(request);
      expect(result.isSuspicious).toBe(true);
      expect(result.reason).toContain('XSS');
    });

    it('should detect suspicious user agents', () => {
      const request = createMockRequest(
        'https://example.com/search?q=test',
        { 'user-agent': 'sqlmap/1.4.7' }
      );
      
      const result = detectAttackPatterns(request);
      expect(result.isSuspicious).toBe(true);
      expect(result.reason).toContain('user agent');
    });

    it('should not flag legitimate requests', () => {
      const request = createMockRequest(
        'https://example.com/search?q=legitimate+search+query',
        { 'user-agent': 'Mozilla/5.0 Chrome/91.0.4472.124 Safari/537.36' }
      );
      
      const result = detectAttackPatterns(request);
      expect(result.isSuspicious).toBe(false);
    });
  });
});
