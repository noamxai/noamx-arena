# NoamX Arena User Guide

## Introduction

Welcome to NoamX Arena, an advanced AI model testing platform that allows you to test, compare, and analyze various AI language models. This comprehensive guide will help you navigate the platform and make the most of its features.

## Getting Started

### Creating an Account

1. Visit the NoamX Arena homepage at [noamx-arena.com](https://noamx-arena.com)
2. Click on the "Sign In" button in the top-right corner
3. Choose your preferred authentication method:
   - Google Account
   - Facebook Account
   - X (Twitter) Account
   - Email and Password
4. Follow the prompts to complete the authentication process
5. Once authenticated, you'll be redirected to your dashboard

### Setting Up API Keys

NoamX Arena uses API keys to connect to various AI model providers. While we provide demo keys for testing, you'll need to add your own API keys for extended usage:

1. Navigate to the "Settings" page from your dashboard
2. Select the "API Keys" tab
3. Add your API keys for any of the following providers:
   - OpenAI (for GPT models)
   - Anthropic (for Claude models)
   - Google AI (for Gemini models)
   - Mistral AI
   - Cohere
   - AI21 Labs
   - Hugging Face

Your API keys are securely stored and encrypted. NoamX Arena automatically detects which key to use based on the model you select.

## Testing AI Models

### Single Model Testing

1. Go to the "Test" page from the main navigation
2. Select a model from the dropdown menu
3. Configure model parameters:
   - Temperature (controls randomness)
   - Max tokens (controls response length)
   - Top-p (controls diversity)
   - Frequency penalty
   - Presence penalty
4. Enter your prompt in the text area
5. Click "Generate" to receive a response
6. View the response, along with metadata such as:
   - Generation time
   - Tokens used
   - Cost estimate

### Multi-Model Testing

1. Go to the "Compare" page from the main navigation
2. Select multiple models using the checkboxes
3. Configure shared parameters that will apply to all models
4. Enter your prompt in the text area
5. Click "Generate" to receive responses from all selected models
6. View side-by-side comparisons of the responses

## Using Custom Prompts

### Creating a Prompt Template

1. Navigate to the "Prompts" page
2. Click "Create New Template"
3. Give your template a name and description
4. Create your prompt template using the editor
5. Use variables with the `{{variable_name}}` syntax
6. Add default values for your variables
7. Save your template

### Using a Prompt Template

1. Go to the "Test" or "Compare" page
2. Click "Use Template" above the prompt input area
3. Select a template from your library or the public library
4. Fill in the variable values specific to your current use case
5. Click "Apply Template" to populate the prompt field
6. Proceed with testing as usual

## Comparing Models

### Visual Comparisons

NoamX Arena provides several visualization tools to compare model performance:

1. **Response Time Chart**: Compare how quickly each model generates responses
2. **Token Usage Chart**: Compare the efficiency of different models
3. **Quality Metrics**: If you rate responses, you can view aggregated quality scores
4. **Cost Comparison**: Compare the estimated cost of using different models

### Saving Comparisons

1. After generating responses from multiple models, click "Save Comparison"
2. Give your comparison a name and optional description
3. Choose whether to make it private or public
4. Click "Save"
5. Access saved comparisons from your dashboard

## Account Management

### Profile Settings

1. Click on your profile picture in the top-right corner
2. Select "Profile" from the dropdown menu
3. Update your profile information:
   - Display name
   - Profile picture
   - Bio
   - Email preferences

### Usage Monitoring

1. Navigate to the "Usage" page from your dashboard
2. View your usage statistics:
   - API calls by model
   - Token consumption
   - Estimated costs
   - Usage trends over time

## Advanced Features

### Batch Testing

1. Go to the "Batch Test" page
2. Upload a CSV file with multiple prompts
3. Select the models you want to test
4. Configure model parameters
5. Click "Start Batch Test"
6. Download results as CSV or JSON when complete

### Custom Evaluation Metrics

1. Navigate to the "Evaluations" page
2. Click "Create Custom Metric"
3. Define your evaluation criteria
4. Create scoring rules
5. Save your custom metric
6. Apply it to future model comparisons

### API Access

NoamX Arena provides an API for programmatic access:

1. Go to the "API" page from your dashboard
2. Generate an API key
3. View documentation for available endpoints
4. Implement the API in your applications

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your API keys are valid and have sufficient credits
2. **Rate Limiting**: If you encounter rate limits, space out your requests or upgrade your plan
3. **Model Unavailability**: Some models may be temporarily unavailable; try again later
4. **Slow Response Times**: Large prompts or high traffic can cause delays

### Getting Help

1. Check the FAQ section for answers to common questions
2. Visit the Community Forum to discuss with other users
3. Contact support through the "Help" button in the bottom-right corner
4. Email support@noamx-arena.com for direct assistance

## Privacy and Security

NoamX Arena takes your privacy and security seriously:

1. Your prompts and responses are encrypted in transit and at rest
2. API keys are securely stored and never shared
3. You control the visibility of your saved comparisons and templates
4. Two-factor authentication is available for additional security

## Updates and New Features

Stay informed about new features and updates:

1. Check the "What's New" section on your dashboard
2. Subscribe to the newsletter for regular updates
3. Follow NoamX Arena on social media platforms
4. Join the beta program to test new features early

Thank you for choosing NoamX Arena for your AI model testing needs!
