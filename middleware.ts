import { NextRequest, NextResponse } from 'next/server';

// Define a rate limit window in seconds
const RATE_LIMIT_WINDOW = 60;
// Define maximum number of requests per window
const MAX_REQUESTS_PER_WINDOW = 100;

// In-memory store for rate limiting
// In production, this should be replaced with Redis or similar
const rateLimitStore = new Map<string, { count: number, timestamp: number }>();

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';"
  );
  
  // Implement rate limiting
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW * 1000;
  
  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.timestamp < windowStart) {
      rateLimitStore.delete(key);
    }
  }
  
  // Check rate limit
  const clientRateLimit = rateLimitStore.get(ip) || { count: 0, timestamp: now };
  
  // Reset count if outside window
  if (clientRateLimit.timestamp < windowStart) {
    clientRateLimit.count = 0;
    clientRateLimit.timestamp = now;
  }
  
  // Increment count
  clientRateLimit.count++;
  rateLimitStore.set(ip, clientRateLimit);
  
  // Set headers for rate limit info
  response.headers.set('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW.toString());
  response.headers.set('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS_PER_WINDOW - clientRateLimit.count).toString());
  response.headers.set('X-RateLimit-Reset', (Math.ceil(clientRateLimit.timestamp / 1000) + RATE_LIMIT_WINDOW).toString());
  
  // If rate limit exceeded, return 429 Too Many Requests
  if (clientRateLimit.count > MAX_REQUESTS_PER_WINDOW) {
    return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': RATE_LIMIT_WINDOW.toString(),
        'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': (Math.ceil(clientRateLimit.timestamp / 1000) + RATE_LIMIT_WINDOW).toString(),
      },
    });
  }
  
  return response;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
    // Apply to authentication routes
    '/auth/:path*',
    // Apply to dashboard routes
    '/dashboard/:path*',
  ],
};
