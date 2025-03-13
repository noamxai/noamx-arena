/**
 * Unit tests for performance utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  useDebounce,
  useThrottle,
  ApiCache,
  imageOptimization,
  isServer,
  isClient
} from '@/app/utils/performance';
import { renderHook, act } from '@testing-library/react';

describe('Performance Utilities', () => {
  describe('useDebounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = vi.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 500));
      
      // Call debounced function multiple times
      act(() => {
        result.current();
        result.current();
        result.current();
      });
      
      // Function should not be called immediately
      expect(mockFn).not.toHaveBeenCalled();
      
      // Advance timer by 499ms
      act(() => {
        vi.advanceTimersByTime(499);
      });
      
      // Function should still not be called
      expect(mockFn).not.toHaveBeenCalled();
      
      // Advance timer to 500ms
      act(() => {
        vi.advanceTimersByTime(1);
      });
      
      // Function should be called once
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('useThrottle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should throttle function calls', () => {
      const mockFn = vi.fn();
      const { result } = renderHook(() => useThrottle(mockFn, 500));
      
      // First call should execute immediately
      act(() => {
        result.current();
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Additional calls within the time limit should be ignored
      act(() => {
        result.current();
        result.current();
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Advance timer past the limit
      act(() => {
        vi.advanceTimersByTime(501);
      });
      
      // The last queued call should execute
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('ApiCache', () => {
    beforeEach(() => {
      ApiCache.clear();
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should cache and retrieve data', () => {
      const testData = { id: 1, name: 'Test' };
      ApiCache.set('test-key', testData);
      
      const cachedData = ApiCache.get('test-key');
      expect(cachedData).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      const cachedData = ApiCache.get('non-existent-key');
      expect(cachedData).toBeNull();
    });

    it('should expire cached data after TTL', () => {
      const testData = { id: 1, name: 'Test' };
      const ttl = 1000; // 1 second
      
      ApiCache.set('test-key', testData);
      
      // Data should be available immediately
      expect(ApiCache.get('test-key', ttl)).toEqual(testData);
      
      // Advance time past TTL
      vi.advanceTimersByTime(1001);
      
      // Data should be expired
      expect(ApiCache.get('test-key', ttl)).toBeNull();
    });
  });

  describe('imageOptimization', () => {
    it('should generate correct srcset', () => {
      const src = 'https://example.com/image.jpg';
      const sizes = [300, 600, 900];
      
      const srcset = imageOptimization.generateSrcSet(src, sizes);
      
      expect(srcset).toBe(
        'https://example.com/image.jpg?width=300 300w, ' +
        'https://example.com/image.jpg?width=600 600w, ' +
        'https://example.com/image.jpg?width=900 900w'
      );
    });
  });

  describe('environment detection', () => {
    const originalWindow = global.window;

    afterEach(() => {
      if (originalWindow === undefined) {
        delete global.window;
      } else {
        global.window = originalWindow;
      }
    });

    it('should correctly detect server environment', () => {
      // Simulate server environment
      delete global.window;
      
      // Re-import to get updated values
      const { isServer: updatedIsServer, isClient: updatedIsClient } = require('@/app/utils/performance');
      
      expect(updatedIsServer).toBe(true);
      expect(updatedIsClient).toBe(false);
    });

    it('should correctly detect client environment', () => {
      // Simulate client environment
      global.window = {} as Window & typeof globalThis;
      
      // Re-import to get updated values
      const { isServer: updatedIsServer, isClient: updatedIsClient } = require('@/app/utils/performance');
      
      expect(updatedIsServer).toBe(false);
      expect(updatedIsClient).toBe(true);
    });
  });
});
