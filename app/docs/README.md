# NoamX Arena

NoamX Arena is an advanced AI model testing platform that allows users to test, compare, and analyze various AI language models with a modern, animated interface and comprehensive features.

## Features

- **Multiple AI Model Integration**: Test and compare responses from various AI models including GPT, Claude, Gemini, Llama, and more
- **Automatic API Key Management**: Secure storage and automatic selection of API keys for different model providers
- **Interactive Testing Console**: Real-time testing with adjustable parameters and response formatting
- **Advanced Comparison Visualizations**: Animated graphs and visualizations for comparing model performance
- **Custom Prompt System**: Create, save, and share prompt templates with variable substitution
- **Multi-Provider Authentication**: Sign in with Google, Facebook, X (Twitter), or email
- **Modern Animated UI**: Smooth animations and interactive elements with a subtle orange, gold, black, and white theme
- **SEO Optimized**: Structured data, meta tags, and SEO-friendly URLs
- **Security Features**: CSRF protection, rate limiting, input validation, and attack detection
- **Performance Optimized**: Code splitting, lazy loading, and API call optimization

## Documentation

- [User Guide](./user-guide.md) - Guide for end users of the platform
- [Deployment Guide](./deployment-guide.md) - Instructions for deploying to production
- [API Documentation](./api-documentation.md) - Reference for the NoamX Arena API

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Visualization**: Recharts, Framer Motion
- **Testing**: Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- API keys for AI model providers (optional for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/noamx/arena.git
cd arena
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the `.env.example` template:
```bash
cp .env.example .env
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
noamx-arena/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── components/       # React components
│   │   ├── ui/           # UI components with animations
│   ├── docs/             # Documentation
│   ├── lib/              # Utility libraries
│   ├── models/           # AI model integrations
│   ├── styles/           # Global styles
│   ├── tests/            # Test files
│   │   ├── unit/         # Unit tests
│   │   ├── integration/  # Integration tests
│   │   ├── e2e/          # End-to-end tests
│   └── utils/            # Utility functions
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- Website: [noamx-arena.com](https://noamx-arena.com)
- Email: support@noamx-arena.com
- GitHub: [github.com/noamx/arena](https://github.com/noamx/arena)
