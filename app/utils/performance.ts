/**
 * Performance optimization utilities for NoamX Arena
 * 
 * This file contains utilities for optimizing application performance,
 * including code splitting, lazy loading, and caching strategies.
 */

import { useEffect, useState } from 'react';

/**
 * Custom hook for lazy loading components
 * @param importFunc - Dynamic import function
 */
export function useLazyComponent<T>(importFunc: () => Promise<{ default: React.ComponentType<T> }>) {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        const { default: ComponentLoaded } = await importFunc();
        if (isMounted) {
          setComponent(() => ComponentLoaded);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load component'));
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [importFunc]);

  return { Component, loading, error };
}

/**
 * Custom hook for debouncing function calls
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 */
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      func(...args);
    }, delay);

    setTimeoutId(id);
  };
}

/**
 * Custom hook for throttling function calls
 * @param func - Function to throttle
 * @param limit - Limit in milliseconds
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  const [lastRun, setLastRun] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [lastArgs, setLastArgs] = useState<Parameters<T> | null>(null);

  return (...args: Parameters<T>) => {
    const now = Date.now();
    setLastArgs(args);

    if (now - lastRun >= limit) {
      func(...args);
      setLastRun(now);
    } else if (!timeoutId) {
      const id = setTimeout(() => {
        if (lastArgs) {
          func(...lastArgs);
          setLastRun(Date.now());
          setTimeoutId(null);
        }
      }, limit - (now - lastRun));

      setTimeoutId(id);
    }
  };
}

/**
 * In-memory cache for API responses
 */
export class ApiCache {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static defaultTtl = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Get data from cache
   * @param key - Cache key
   * @param ttl - Time to live in milliseconds
   */
  static get<T>(key: string, ttl = ApiCache.defaultTtl): T | null {
    const cached = ApiCache.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > ttl) {
      ApiCache.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Set data in cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  static set(key: string, data: any): void {
    ApiCache.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Clean up cache if it gets too large
    if (ApiCache.cache.size > 100) {
      ApiCache.cleanup();
    }
  }

  /**
   * Clear cache
   */
  static clear(): void {
    ApiCache.cache.clear();
  }

  /**
   * Clean up expired cache entries
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, value] of ApiCache.cache.entries()) {
      if (now - value.timestamp > ApiCache.defaultTtl) {
        ApiCache.cache.delete(key);
      }
    }
  }
}

/**
 * Image optimization utility
 */
export const imageOptimization = {
  /**
   * Generate responsive image srcset
   * @param src - Image source URL
   * @param sizes - Array of sizes in pixels
   */
  generateSrcSet(src: string, sizes: number[]): string {
    return sizes
      .map(size => {
        const url = new URL(src);
        url.searchParams.set('width', size.toString());
        return `${url.toString()} ${size}w`;
      })
      .join(', ');
  },

  /**
   * Get image dimensions
   * @param file - Image file
   */
  getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Compress image
   * @param file - Image file
   * @param quality - Quality (0-1)
   * @param maxWidth - Maximum width
   */
  async compressImage(
    file: File,
    quality = 0.8,
    maxWidth = 1920
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            resolve(new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            }));
          },
          file.type,
          quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },
};

/**
 * Measure component render time
 * @param componentName - Name of the component
 */
export function measureRenderTime(componentName: string): () => void {
  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    console.log(`[Performance] ${componentName} rendered in ${endTime - startTime}ms`);
  };
}

/**
 * Check if code is running on server or client
 */
export const isServer = typeof window === 'undefined';
export const isClient = !isServer;

/**
 * Detect slow network connection
 */
export function useNetworkStatus() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    if (!isClient) return;

    // Check connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnectionStatus = () => {
        const effectiveType = connection.effectiveType;
        setIsSlowConnection(effectiveType === 'slow-2g' || effectiveType === '2g');
      };
      
      updateConnectionStatus();
      connection.addEventListener('change', updateConnectionStatus);
      
      return () => {
        connection.removeEventListener('change', updateConnectionStatus);
      };
    }
    
    // Fallback: measure loading time of a small resource
    const checkConnectionSpeed = async () => {
      const startTime = Date.now();
      try {
        await fetch('/api/ping', { cache: 'no-store' });
        const endTime = Date.now();
        setIsSlowConnection(endTime - startTime > 1000); // Slow if ping takes more than 1 second
      } catch (error) {
        setIsSlowConnection(true);
      }
    };
    
    checkConnectionSpeed();
  }, []);
  
  return { isSlowConnection };
}
