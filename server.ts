import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Agent, run } from '@openai/agents';
import { model } from './constants';
import categorySearch from './tools/categorySearch';
import coinPlatforms from './tools/coinPlatforms';
import coinsMarketData from './tools/coinsMarketData';

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting middleware (2 requests per minute per IP)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2, // limit each IP to 2 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests',
    message:
      'You have exceeded the maximum number of requests per minute. Please try again later.',
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Initialize the agent
const cryptoExpertAgent = new Agent({
  name: 'Cryptocurrency Expert Agent',
  instructions:
    'You are a cryptocurrency expert agent that is responsible for providing information about cryptocurrencies. You should use the tools provided to you to get the information you need.',
  model: model,
  tools: [categorySearch, coinPlatforms, coinsMarketData],
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cryptocurrency Expert Agent is running' });
});

// Main agent endpoint
app.post('/query', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;

    if (!query) {
      res.status(400).json({
        error: 'Query is required',
        message: 'Please provide a query in the request body',
      });
      return;
    }

    // Validate query length
    if (query.length > Number(process.env.MAX_QUERY_LENGTH)) {
      res.status(400).json({
        error: 'Query too long',
        message: `Query must be ${process.env.MAX_QUERY_LENGTH} characters or less. Current length: ${query.length}`,
      });
      return;
    }

    console.log(`🤖 Processing query: ${query}`);

    // Run the agent with the user's query
    const result = await run(cryptoExpertAgent, query);

    console.log('✅ Query processed successfully');

    res.json({
      success: true,
      query: query,
      response: result.finalOutput,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error processing query:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Cryptocurrency Expert Agent server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Query endpoint: http://localhost:${PORT}/query`);
});

export default app;
