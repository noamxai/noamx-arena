# NoamX Arena API Documentation

## Overview

The NoamX Arena API allows developers to programmatically access AI model testing functionality, user data, and comparison results. This documentation provides details on available endpoints, authentication, request/response formats, and example usage.

## Authentication

All API requests require authentication using an API key.

### Obtaining an API Key

1. Log in to your NoamX Arena account
2. Navigate to Settings > API Access
3. Click "Generate API Key"
4. Store your API key securely; it will only be shown once

### Using Your API Key

Include your API key in the request header:

```
Authorization: Bearer YOUR_API_KEY
```

## Base URL

All API endpoints are relative to:

```
https://api.noamx-arena.com/v1
```

## Rate Limits

- Free tier: 100 requests per minute
- Pro tier: 500 requests per minute
- Enterprise tier: Custom limits

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1583858662
```

## Endpoints

### Models

#### List Available Models

```
GET /models
```

Returns a list of all available AI models with their capabilities and parameters.

**Response**

```json
{
  "models": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "provider": "OpenAI",
      "capabilities": ["text-generation", "code-generation", "reasoning"],
      "contextWindow": 8192,
      "maxTokens": 4096,
      "pricingInfo": "$0.03 per 1K input tokens, $0.06 per 1K output tokens"
    },
    {
      "id": "claude-3-opus",
      "name": "Claude 3 Opus",
      "provider": "Anthropic",
      "capabilities": ["text-generation", "reasoning", "instruction-following"],
      "contextWindow": 200000,
      "maxTokens": 4096,
      "pricingInfo": "$15 per million input tokens, $75 per million output tokens"
    }
    // Additional models...
  ]
}
```

#### Get Model Details

```
GET /models/{model_id}
```

Returns detailed information about a specific model.

**Parameters**

- `model_id` (path): ID of the model

**Response**

```json
{
  "id": "gpt-4",
  "name": "GPT-4",
  "provider": "OpenAI",
  "description": "GPT-4 is a large multimodal model that can solve difficult problems with greater accuracy than earlier models.",
  "capabilities": ["text-generation", "code-generation", "reasoning"],
  "contextWindow": 8192,
  "maxTokens": 4096,
  "supportedParameters": {
    "temperature": {
      "type": "float",
      "min": 0,
      "max": 2,
      "default": 0.7
    },
    "top_p": {
      "type": "float",
      "min": 0,
      "max": 1,
      "default": 1
    }
    // Additional parameters...
  },
  "pricingInfo": "$0.03 per 1K input tokens, $0.06 per 1K output tokens",
  "releaseDate": "2023-03-14"
}
```

### Queries

#### Query Single Model

```
POST /query
```

Send a prompt to a single AI model and receive the response.

**Request Body**

```json
{
  "model": "gpt-4",
  "prompt": "Explain quantum computing in simple terms",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 500,
    "top_p": 1
  }
}
```

**Response**

```json
{
  "id": "query_123456789",
  "model": "gpt-4",
  "prompt": "Explain quantum computing in simple terms",
  "response": "Quantum computing is like traditional computing but uses quantum bits or 'qubits' instead of regular bits...",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 500,
    "top_p": 1
  },
  "usage": {
    "prompt_tokens": 6,
    "completion_tokens": 150,
    "total_tokens": 156
  },
  "processingTime": 2.45,
  "timestamp": "2025-03-13T14:28:00Z"
}
```

#### Query Multiple Models

```
POST /query/compare
```

Send the same prompt to multiple models and receive all responses.

**Request Body**

```json
{
  "models": ["gpt-4", "claude-3-opus", "gemini-2-flash"],
  "prompt": "Explain quantum computing in simple terms",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 500
  }
}
```

**Response**

```json
{
  "id": "comparison_123456789",
  "prompt": "Explain quantum computing in simple terms",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 500
  },
  "results": [
    {
      "model": "gpt-4",
      "response": "Quantum computing is like traditional computing but uses quantum bits or 'qubits' instead of regular bits...",
      "usage": {
        "prompt_tokens": 6,
        "completion_tokens": 150,
        "total_tokens": 156
      },
      "processingTime": 2.45
    },
    {
      "model": "claude-3-opus",
      "response": "Think of quantum computing as a new way to calculate things. Regular computers use bits...",
      "usage": {
        "prompt_tokens": 6,
        "completion_tokens": 180,
        "total_tokens": 186
      },
      "processingTime": 1.89
    },
    {
      "model": "gemini-2-flash",
      "response": "Quantum computing harnesses quantum mechanics to process information in new ways...",
      "usage": {
        "prompt_tokens": 6,
        "completion_tokens": 160,
        "total_tokens": 166
      },
      "processingTime": 1.75
    }
  ],
  "timestamp": "2025-03-13T14:28:30Z"
}
```

### Prompt Templates

#### List Templates

```
GET /templates
```

Returns a list of prompt templates available to the user.

**Query Parameters**

- `visibility` (optional): Filter by visibility (`private`, `public`, or `all`). Default: `all`
- `category` (optional): Filter by category
- `page` (optional): Page number for pagination. Default: 1
- `limit` (optional): Number of results per page. Default: 20

**Response**

```json
{
  "templates": [
    {
      "id": "template_123456789",
      "name": "Product Description Generator",
      "description": "Generates marketing descriptions for products",
      "template": "Create a compelling product description for {{product_name}}, which is a {{product_type}} with the following features: {{features}}.",
      "variables": ["product_name", "product_type", "features"],
      "category": "Marketing",
      "visibility": "public",
      "author": {
        "id": "user_987654321",
        "name": "Jane Doe"
      },
      "createdAt": "2025-02-15T10:30:00Z",
      "updatedAt": "2025-02-15T10:30:00Z"
    }
    // Additional templates...
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

#### Get Template

```
GET /templates/{template_id}
```

Returns details of a specific prompt template.

**Parameters**

- `template_id` (path): ID of the template

**Response**

```json
{
  "id": "template_123456789",
  "name": "Product Description Generator",
  "description": "Generates marketing descriptions for products",
  "template": "Create a compelling product description for {{product_name}}, which is a {{product_type}} with the following features: {{features}}.",
  "variables": [
    {
      "name": "product_name",
      "description": "The name of the product",
      "required": true,
      "defaultValue": ""
    },
    {
      "name": "product_type",
      "description": "The type or category of the product",
      "required": true,
      "defaultValue": ""
    },
    {
      "name": "features",
      "description": "Comma-separated list of product features",
      "required": true,
      "defaultValue": ""
    }
  ],
  "category": "Marketing",
  "visibility": "public",
  "author": {
    "id": "user_987654321",
    "name": "Jane Doe"
  },
  "ratings": {
    "average": 4.7,
    "count": 15
  },
  "createdAt": "2025-02-15T10:30:00Z",
  "updatedAt": "2025-02-15T10:30:00Z"
}
```

#### Create Template

```
POST /templates
```

Creates a new prompt template.

**Request Body**

```json
{
  "name": "Technical Blog Outline",
  "description": "Creates an outline for a technical blog post",
  "template": "Create a detailed outline for a technical blog post about {{topic}} aimed at {{audience}} with a focus on {{focus_area}}.",
  "variables": [
    {
      "name": "topic",
      "description": "The main topic of the blog post",
      "required": true,
      "defaultValue": ""
    },
    {
      "name": "audience",
      "description": "The target audience (e.g., beginners, experts)",
      "required": true,
      "defaultValue": "intermediate developers"
    },
    {
      "name": "focus_area",
      "description": "Specific aspect to focus on",
      "required": false,
      "defaultValue": "practical applications"
    }
  ],
  "category": "Content Creation",
  "visibility": "private"
}
```

**Response**

```json
{
  "id": "template_987654321",
  "name": "Technical Blog Outline",
  "description": "Creates an outline for a technical blog post",
  "template": "Create a detailed outline for a technical blog post about {{topic}} aimed at {{audience}} with a focus on {{focus_area}}.",
  "variables": [
    {
      "name": "topic",
      "description": "The main topic of the blog post",
      "required": true,
      "defaultValue": ""
    },
    {
      "name": "audience",
      "description": "The target audience (e.g., beginners, experts)",
      "required": true,
      "defaultValue": "intermediate developers"
    },
    {
      "name": "focus_area",
      "description": "Specific aspect to focus on",
      "required": false,
      "defaultValue": "practical applications"
    }
  ],
  "category": "Content Creation",
  "visibility": "private",
  "author": {
    "id": "user_123456789",
    "name": "Current User"
  },
  "createdAt": "2025-03-13T14:29:00Z",
  "updatedAt": "2025-03-13T14:29:00Z"
}
```

### Comparisons

#### List Saved Comparisons

```
GET /comparisons
```

Returns a list of saved model comparisons.

**Query Parameters**

- `visibility` (optional): Filter by visibility (`private`, `public`, or `all`). Default: `all`
- `page` (optional): Page number for pagination. Default: 1
- `limit` (optional): Number of results per page. Default: 20

**Response**

```json
{
  "comparisons": [
    {
      "id": "comparison_123456789",
      "name": "Quantum Computing Explanation",
      "description": "Comparing how different models explain quantum computing",
      "models": ["gpt-4", "claude-3-opus", "gemini-2-flash"],
      "prompt": "Explain quantum computing in simple terms",
      "visibility": "public",
      "author": {
        "id": "user_987654321",
        "name": "Jane Doe"
      },
      "createdAt": "2025-03-10T09:15:00Z"
    }
    // Additional comparisons...
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

#### Get Comparison Details

```
GET /comparisons/{comparison_id}
```

Returns detailed information about a specific saved comparison.

**Parameters**

- `comparison_id` (path): ID of the comparison

**Response**

```json
{
  "id": "comparison_123456789",
  "name": "Quantum Computing Explanation",
  "description": "Comparing how different models explain quantum computing",
  "prompt": "Explain quantum computing in simple terms",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 500
  },
  "results": [
    {
      "model": "gpt-4",
      "response": "Quantum computing is like traditional computing but uses quantum bits or 'qubits' instead of regular bits...",
      "usage": {
        "prompt_tokens": 6,
        "completion_tokens": 150,
        "total_tokens": 156
      },
      "processingTime": 2.45
    },
    {
      "model": "claude-3-opus",
      "response": "Think of quantum computing as a new way to calculate things. Regular computers use bits...",
      "usage": {
        "prompt_tokens": 6,
        "completion_tokens": 180,
        "total_tokens": 186
      },
      "processingTime": 1.89
    },
    {
      "model": "gemini-2-flash",
      "response": "Quantum computing harnesses quantum mechanics to process information in new ways...",
      "usage": {
        "prompt_tokens": 6,
        "completion_tokens": 160,
        "total_tokens": 166
      },
      "processingTime": 1.75
    }
  ],
  "metrics": {
    "responseTime": {
      "fastest": "gemini-2-flash",
      "slowest": "gpt-4"
    },
    "tokenUsage": {
      "most": "claude-3-opus",
      "least": "gpt-4"
    }
  },
  "visibility": "public",
  "author": {
    "id": "user_987654321",
    "name": "Jane Doe"
  },
  "createdAt": "2025-03-10T09:15:00Z"
}
```

#### Save Comparison

```
POST /comparisons
```

Saves a model comparison result.

**Request Body**

```json
{
  "name": "Code Refactoring Approaches",
  "description": "Comparing how different models approach code refactoring",
  "prompt": "Refactor this code to be more efficient: [code snippet]",
  "models": ["gpt-4", "claude-3-opus", "llama-3-70b"],
  "parameters": {
    "temperature": 0.2,
    "max_tokens": 1000
  },
  "results": [
    {
      "model": "gpt-4",
      "response": "Here's a refactored version of your code...",
      "usage": {
        "prompt_tokens": 50,
        "completion_tokens": 300,
        "total_tokens": 350
      },
      "processingTime": 3.2
    },
    // Other model results...
  ],
  "visibility": "private"
}
```

**Response**

```json
{
  "id": "comparison_567890123",
  "name": "Code Refactoring Approaches",
  "description": "Comparing how different models approach code refactoring",
  "prompt": "Refactor this code to be more efficient: [code snippet]",
  "models": ["gpt-4", "claude-3-opus", "llama-3-70b"],
  "visibility": "private",
  "author": {
    "id": "user_123456789",
    "name": "Current User"
  },
  "createdAt": "2025-03-13T14:30:00Z",
  "url": "https://noamx-arena.com/comparisons/567890123"
}
```

### User Data

#### Get User Profile

```
GET /user
```

Returns the current user's profile information.

**Response**

```json
{
  "id": "user_123456789",
  "name": "John Smith",
  "email": "john.smith@example.com",
  "plan": "pro",
  "usage": {
    "queries": {
      "current": 450,
      "limit": 1000
    },
    "tokens": {
      "current": 1250000,
      "limit": 5000000
    }
  },
  "createdAt": "2024-11-15T08:30:00Z",
  "lastLogin": "2025-03-13T09:45:00Z"
}
```

#### Get Usage Statistics

```
GET /user/usage
```

Returns detailed usage statistics for the current user.

**Query Parameters**

- `period` (optional): Time period for statistics (`day`, `week`, `month`, `year`). Default: `month`
- `start_date` (optional): Start date for custom period (ISO format)
- `end_date` (optional): End date for custom period (ISO format)

**Response**

```json
{
  "period": "month",
  "start_date": "2025-02-13T00:00:00Z",
  "end_date": "2025-03-13T23:59:59Z",
  "queries": {
    "total": 450,
    "limit": 1000,
    "by_model": {
      "gpt-4": 150,
      "claude-3-opus": 120,
      "gemini-2-flash": 100,
      "other": 80
    },
    "by_day": [
      {
        "date": "2025-03-13",
        "count": 15
      },
      {
        "date": "2025-03-12",
        "count": 22
      }
      // Additional days...
    ]
  },
  "tokens": {
    "total": 1250000,
    "limit": 5000000,
    "input": 350000,
    "output": 900000,
    "by_model": {
      "gpt-4": 500000,
      "claude-3-opus": 400000,
      "gemini-2-flash": 250000,
      "other": 100000
    }
  },
  "estimated_cost": {
    "total": 25.75,
    "by_model": {
      "gpt-4": 15.00,
      "claude-3-opus": 7.50,
      "gemini-2-flash": 2.25,
      "other": 1.00
    },
    "currency": "USD"
  }
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid API key
- `403 Forbidden`: Valid API key but insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

Error responses include a JSON object with details:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Invalid model ID specified",
    "details": "The model 'gpt-5' does not exist or is not available"
  }
}
```

## Webhooks

Set up webhooks to receive notifications about events in your NoamX Arena account.

### Available Events

- `query.completed`: Triggered when a model query is completed
- `comparison.saved`: Triggered when a comparison is saved
- `template.created`: Triggered when a template is created
- `usage.limit.approaching`: Triggered when usage approaches the plan limit

### Configuring Webhooks

1. Go to Settings > Webhooks in your NoamX Arena dashboard
2. Click "Add Webhook"
3. Enter the URL that will receive webhook events
4. Select the events you want to subscribe to
5. Set an optional secret key for signature verification

### Webhook Payload

```json
{
  "id": "evt_123456789",
  "type": "query.completed",
  "created": "2025-03-13T14:31:00Z",
  "data": {
    "query_id": "query_987654321",
    "model": "gpt-4",
    "status": "completed",
    "processing_time": 2.45,
    "tokens_used": 156
  }
}
```

### Verifying Webhook Signatures

Webhooks include a signature in the `X-NoamX-Signature` header. Verify this signature to ensure the webhook came from NoamX Arena:

```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    computed_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(computed_signature, signature)
```

## SDKs and Client Libraries

Official client libraries are available for:

- JavaScript/TypeScript: `npm install noamx-arena-api`
- Python: `pip install noamx-arena-api`
- Ruby: `gem install noamx-arena-api`
- PHP: `composer require noamx/arena-api`

### JavaScript Example

```javascript
const NoamXArena = require('noamx-arena-api');

const client = new NoamXArena('your-api-key');

async function queryModel() {
  try {
    const response = await client.query({
      model: 'gpt-4',
      prompt: 'Explain quantum computing in simple terms',
      parameters: {
        temperature: 0.7,
        max_tokens: 500
      }
    });
    
    console.log(response.response);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

queryModel();
```

### Python Example

```python
from noamx_arena_api import NoamXArena

client = NoamXArena('your-api-key')

try:
    response = client.query(
        model='claude-3-opus',
        prompt='Explain quantum computing in simple terms',
        parameters={
            'temperature': 0.7,
            'max_tokens': 500
        }
    )
    
    print(response.response)
except Exception as e:
    print(f"Error: {str(e)}")
```

## Changelog

### v1.2.0 (2025-03-01)
- Added batch processing endpoint
- Improved rate limiting with more granular controls
- Added support for file uploads in queries

### v1.1.0 (2025-01-15)
- Added webhooks support
- Enhanced comparison metrics
- Added usage statistics endpoints

### v1.0.0 (2024-12-01)
- Initial API release
