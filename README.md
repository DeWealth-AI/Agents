# Crypto Expert Agent

A TypeScript project using OpenAI Agents to provide cryptocurrency assistance with real-time market data and intelligent content management.

## Features

- **Cryptocurrency Market Data**: Get real-time market data for cryptocurrencies using CoinGecko API
- **Cryptocurrency Categories**: Fetch and analyze different cryptocurrency categories
- **AI-Powered Assistance**: Uses GPT-4o-mini to provide intelligent crypto insights and recommendations
- **Intelligent Content Management**: Automatically checks for existing relevant content before responding and stores new responses for future reference
- **Vector Database Integration**: Uses Pinecone for semantic search and content storage
- **Interactive CLI**: Beautiful terminal interface with loading spinners and status indicators
- **REST API**: Express server with endpoints for programmatic access to the agent

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key
- Pinecone API key

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with your API keys:

```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
PINECONE_API_KEY=your_actual_pinecone_api_key_here
```

You can get an API key from [OpenAI's platform](https://platform.openai.com/api-keys) and [Pinecone's platform](https://app.pinecone.io/).

## Database Functionality

The agent now includes intelligent content management with the following workflow:

1. **Content Check**: Before responding to any query, the agent automatically searches the database for existing relevant content using semantic similarity
2. **Response Generation**: The agent generates a response using current market data and incorporates any relevant existing information found
3. **Content Storage**: After providing a response, the agent automatically stores the new information in the database for future reference

### Database Tools

- **`check_existing_content`**: Searches for existing content related to a topic with configurable similarity threshold
- **`upsert_content`**: Stores new content with metadata for future retrieval

### How It Works

1. When a user asks a question, the agent first checks if similar information has been provided before
2. If relevant existing content is found (similarity score ≥ 0.4), it's incorporated into the response
3. The agent then gathers current market data using the available tools
4. After providing the response, the agent stores the new information in the database
5. Future queries about similar topics will benefit from this stored knowledge

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
- `npm run server:dev` - Start Express server in development mode
- `npm run server:build` - Build the Express server
- `npm run server:start` - Start the built Express server
- `npm run build` - Build for development (with source maps and declarations)
- `npm run build:prod` - Build for production (optimized)
- `npm start` - Run the built application
- `npm run clean` - Clean build artifacts
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier

## API Usage

The project includes an Express server that exposes the cryptocurrency agent via REST API endpoints.

### Starting the Server

**Development mode:**

```bash
npm run server:dev
```

**Production mode:**

```bash
npm run server:build
npm run server:start
```

The server runs on port 3000 by default (configurable via `PORT` environment variable).

### Available Endpoints

#### Health Check

```
GET /health
```

Returns server status:

```json
{
  "status": "OK",
  "message": "Cryptocurrency Expert Agent is running"
}
```

#### Query Agent

```
POST /query
```

Send a query to the cryptocurrency agent:

**Request Body:**

```json
{
  "query": "Give me the top 10 cryptocurrencies by market cap"
}
```

**Response:**

```json
{
  "success": true,
  "query": "Give me the top 10 cryptocurrencies by market cap",
  "response": "Based on the current market data, here are the top 10 cryptocurrencies by market cap...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Example API Usage

**Using curl:**

```bash
# Health check
curl http://localhost:3000/health

# Query the agent
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the top 5 cryptocurrencies by market cap?"}'
```

**Using JavaScript/Node.js:**

```javascript
const response = await fetch('http://localhost:3000/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'Give me information about Bitcoin',
  }),
});

const data = await response.json();
console.log(data.response);
```

## Project Structure

```
agents/
├── index.ts                    # Main application entry point
├── server.ts                   # Express server with API endpoints
├── constants.ts                # Shared constants and configurations
├── tools/                      # Agent tools directory
│   ├── categorySearch.ts       # Cryptocurrency categories tool
│   ├── marketDataByCategory.ts # Market data by category tool
│   └── databaseOperations.ts   # Database check and upsert tools
├── utils/                      # Utility functions
│   └── embeddings.ts           # Embedding generation utility
├── types/                      # TypeScript type definitions
│   ├── CoingeckoCategories.ts
│   └── CoingeckoPlatforms.ts
├── dist/                       # Build output directory
├── tsconfig.json               # TypeScript configuration for development
├── tsconfig.prod.json          # TypeScript configuration for production
├── package.json                # Project dependencies and scripts
├── eslint.config.js            # ESLint configuration
└── .prettierrc                 # Prettier configuration
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

## Example Usage

The application currently runs with a predefined query: "Give me top 3 coins by market cap"

You can modify the query in `index.ts` to ask different cryptocurrency-related questions.
