import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Agent, run } from '@openai/agents';
import { model } from './constants';
import categorySearch from './tools/categorySearch';
import coinPlatforms from './tools/coinPlatforms';
import coinsMarketData from './tools/coinsMarketData';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
app.post('/query', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Query is required',
        message: 'Please provide a query in the request body',
      });
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
