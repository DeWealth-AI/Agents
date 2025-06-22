# Crypto Expert Agent

A TypeScript project using OpenAI Agents to provide cryptocurrency assistance with real-time market data.

## Features

- **Cryptocurrency Market Data**: Get real-time market data for cryptocurrencies using CoinGecko API
- **Cryptocurrency Categories**: Fetch and analyze different cryptocurrency categories
- **AI-Powered Assistance**: Uses GPT-4o-mini to provide intelligent crypto insights and recommendations
- **Interactive CLI**: Beautiful terminal interface with loading spinners and status indicators

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with your OpenAI API key:

```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
```

You can get an API key from [OpenAI's platform](https://platform.openai.com/api-keys).

## Development

To run the project in development mode with hot reloading:

```bash
npm run dev
```

This will start the TypeScript compiler in watch mode and automatically restart when files change.

## Building

### Development Build

To create a development build with source maps and type declarations:

```bash
npm run build
```

### Production Build

To create an optimized production build:

```bash
npm run build:prod
```

## Running

To run the built application:

```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for development (with source maps and declarations)
- `npm run build:prod` - Build for production (optimized)
- `npm start` - Run the built application
- `npm run clean` - Clean build artifacts
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier

## Project Structure

```
agents/
├── index.ts              # Main application entry point
├── tools/                # Agent tools directory
│   ├── categorySearch.ts # Cryptocurrency categories tool
│   └── coinsMarketData.ts # Market data tool
├── dist/                 # Build output directory
├── tsconfig.json         # TypeScript configuration for development
├── tsconfig.prod.json    # TypeScript configuration for production
├── package.json          # Project dependencies and scripts
├── eslint.config.js      # ESLint configuration
├── .prettierrc          # Prettier configuration
└── README.md            # This file
```

## Configuration

The project uses two TypeScript configurations:

- `tsconfig.json` - Development configuration with source maps and type declarations
- `tsconfig.prod.json` - Production configuration optimized for size and performance

## Dependencies

### Core Dependencies

- `@openai/agents` - OpenAI Agents SDK
- `@openai/agents-extensions` - OpenAI Agents extensions
- `@ai-sdk/openai` - AI SDK for OpenAI integration
- `dotenv` - Environment variable management
- `ora` - Terminal spinner for better UX
- `zod` - TypeScript-first schema validation

### Development Dependencies

- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution engine for development
- `@types/node` - Node.js type definitions
- `eslint` - Code linting
- `prettier` - Code formatting
- `@typescript-eslint/eslint-plugin` - TypeScript ESLint plugin
- `@typescript-eslint/parser` - TypeScript ESLint parser

## How It Works

The application creates an AI agent specialized in cryptocurrency assistance with two main tools:

1. **Category Search Tool**: Fetches cryptocurrency categories from CoinGecko API
2. **Market Data Tool**: Retrieves real-time market data for cryptocurrencies

The agent uses GPT-4o-mini to process user queries and provide intelligent responses based on the available tools and real-time data.

## Example Usage

The application currently runs with a predefined query: "Give me top 3 coins by market cap"

You can modify the query in `index.ts` to ask different cryptocurrency-related questions.
