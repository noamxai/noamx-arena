/**
 * Security utilities for NoamX Arena
 * 
 * This file contains security-related utilities for protecting the application
 * against common web vulnerabilities and attacks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 100;
const IP_RATE_LIMIT_MAP = new Map<string, { count: number; resetTime: number }>();

// CSRF token configuration
const CSRF_TOKEN_COOKIE_NAME = 'noamx-csrf-token';
const CSRF_TOKEN_HEADER_NAME = 'X-CSRF-Token';

/**
 * Generate a secure random token
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a CSRF token and set it as a cookie
 */
export function generateCsrfToken(response: NextResponse): string {
  const token = generateSecureToken();
  
  // Set CSRF token as a secure, http-only cookie
  response.cookies.set({
    name: CSRF_TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  
  return token;
}

/**
 * Validate CSRF token from request
 */
export function validateCsrfToken(request: NextRequest): boolean {
  const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER_NAME);
  
  if (!cookieToken || !headerToken) {
    return false;
  }
  
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );
}

/**
 * Apply rate limiting to requests
 */
export function applyRateLimit(request: NextRequest): { 
  allowed: boolean; 
  remainingRequests: number;
  resetTime: number;
} {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  
  // Get or create rate limit entry for IP
  let rateLimitInfo = IP_RATE_LIMIT_MAP.get(ip);
  
  if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
    // Reset rate limit if window has expired
    rateLimitInfo = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
  }
  
  // Increment request count
  rateLimitInfo.count += 1;
  IP_RATE_LIMIT_MAP.set(ip, rateLimitInfo);
  
  // Check if rate limit is exceeded
  const allowed = rateLimitInfo.count <= MAX_REQUESTS_PER_WINDOW;
  const remainingRequests = Math.max(0, MAX_REQUESTS_PER_WINDOW - rateLimitInfo.count);
  
  // Clean up old entries periodically
  if (IP_RATE_LIMIT_MAP.size > 10000) {
    cleanupRateLimitMap();
  }
  
  return {
    allowed,
    remainingRequests,
    resetTime: rateLimitInfo.resetTime,
  };
}

/**
 * Clean up expired rate limit entries
 */
function cleanupRateLimitMap() {
  const now = Date.now();
  
  for (const [ip, info] of IP_RATE_LIMIT_MAP.entries()) {
    if (now > info.resetTime) {
      IP_RATE_LIMIT_MAP.delete(ip);
    }
  }
}

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  // Replace potentially dangerous characters
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate and sanitize user input using Zod
 */
export function validateInput<T>(
  input: unknown,
  schema: z.ZodType<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validData = schema.parse(input);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') 
      };
    }
    return { success: false, error: 'Invalid input' };
  }
}

/**
 * Hash a password securely
 */
export async function hashPassword(password: string): Promise<string> {
  // In a real implementation, use a proper password hashing library like bcrypt
  // This is a simple example using Node's crypto module
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, storedHash] = hashedPassword.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return storedHash === hash;
}

/**
 * Set secure headers for response
 */
export function setSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://api.aimlapi.com https://api.openai.com https://generativelanguage.googleapis.com https://api.anthropic.com https://api-inference.huggingface.co;"
  );
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  return response;
}

/**
 * Create a nonce for CSP
 */
export function createCspNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Detect common attack patterns in requests
 */
export function detectAttackPatterns(request: NextRequest): {
  isSuspicious: boolean;
  reason?: string;
} {
  const url = request.nextUrl.toString();
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check for SQL injection attempts
  const sqlInjectionPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(\;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
  ];
  
  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(url)) {
      return { isSuspicious: true, reason: 'Potential SQL injection attempt' };
    }
  }
  
  // Check for XSS attempts
  const xssPatterns = [
    /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i,
    /((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/i,
    /((\%3C)|<)[^\n]+((\%3E)|>)/i,
  ];
  
  for (const pattern of xssPatterns) {
    if (pattern.test(url)) {
      return { isSuspicious: true, reason: 'Potential XSS attempt' };
    }
  }
  
  // Check for suspicious user agents
  const suspiciousUserAgents = [
    /sqlmap/i,
    /nikto/i,
    /nessus/i,
    /nmap/i,
    /acunetix/i,
    /burpsuite/i,
  ];
  
  for (const pattern of suspiciousUserAgents) {
    if (pattern.test(userAgent)) {
      return { isSuspicious: true, reason: 'Suspicious user agent' };
    }
  }
  
  return { isSuspicious: false };
}

/**
 * Log security events
 */
export function logSecurityEvent(
  event: string,
  request: NextRequest,
  details?: Record<string, any>
): void {
  const timestamp = new Date().toISOString();
  const ip = request.ip || 'unknown';
  const method = request.method;
  const url = request.nextUrl.toString();
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  console.log(JSON.stringify({
    timestamp,
    event,
    ip,
    method,
    url,
    userAgent,
    ...details,
  }));
  
  // In a production environment, you would send this to a logging service
}
