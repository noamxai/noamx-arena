import { NextApiRequest, NextApiResponse } from 'next';

// Define types for the handler and middleware
type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;
type Middleware = (handler: ApiHandler) => ApiHandler;

// CSRF protection middleware
export const withCsrf: Middleware = (handler) => async (req, res) => {
  // Check CSRF token for non-GET requests
  if (req.method !== 'GET') {
    const csrfToken = req.headers['x-csrf-token'];
    const sessionCsrfToken = req.cookies['csrf-token'];
    
    if (!csrfToken || !sessionCsrfToken || csrfToken !== sessionCsrfToken) {
      return res.status(403).json({ error: 'CSRF token validation failed' });
    }
  }
  
  return handler(req, res);
};

// Input validation middleware
export const withValidation = (schema: any): Middleware => (handler) => async (req, res) => {
  try {
    // Validate request body against schema
    if (req.body) {
      await schema.validate(req.body);
    }
    return handler(req, res);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// API key validation middleware
export const withApiKeyValidation: Middleware = (handler) => async (req, res) => {
  // Skip validation for authentication routes
  if (req.url?.startsWith('/api/auth')) {
    return handler(req, res);
  }
  
  const apiKey = req.headers['x-api-key'] as string;
  
  // In a real implementation, you would validate the API key against your database
  // This is a simplified example
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }
  
  return handler(req, res);
};

// Error handling middleware
export const withErrorHandling: Middleware = (handler) => async (req, res) => {
  try {
    return await handler(req, res);
  } catch (error) {
    console.error('API error:', error);
    
    // Prevent leaking sensitive error details
    const message = process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message;
    
    return res.status(500).json({ error: message });
  }
};

// Combine multiple middlewares
export const withMiddleware = (...middlewares: Middleware[]) => (handler: ApiHandler): ApiHandler => {
  return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
};

// Usage example:
// export default withMiddleware(
//   withErrorHandling,
//   withApiKeyValidation,
//   withCsrf,
//   withValidation(mySchema)
// )(async (req, res) => {
//   // Handler implementation
// });
