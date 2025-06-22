import { tool } from '@openai/agents';
import ora from 'ora';
import { z } from 'zod';

const coinsMarketData = tool({
  name: 'coins_market_data',
  description: 'Get the market data for a given coin',
  parameters: z.object({}),
  execute: async () => {
    const spinner = ora('📊 Fetching market data...').start();

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`
      );
      const data = await response.json();
      spinner.succeed('✅ Market data fetched successfully');
      return data;
    } catch (error) {
      spinner.fail('❌ Failed to fetch market data');
      throw error;
    }
  },
});

export default coinsMarketData;
