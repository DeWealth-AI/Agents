import { tool } from '@openai/agents';
import ora from 'ora';
import { z } from 'zod';

const coinsMarketData = tool({
  name: 'coins_market_data',
  description:
    'Get the market data for all cryptocurrencies. If only interested in a specific category pass it as a parameter, and if only interested on certain coins pass their ids or names as a parameter',
  parameters: z.object({
    vs_currency: z
      .string()
      .default('usd')
      .describe('The currency to use for the market data, 3 letter code'),
    ids: z.string().describe('Comma separated list of coin ids'),
    names: z.string().describe('Comma separated list of coin names'),
    category: z
      .string()
      .describe('The category of the coins we are searching for'),
  }),
  execute: async ({ vs_currency, ids, names, category }) => {
    const spinner = ora('📊 Fetching market data...').start();

    const idsParam = ids ? `&ids=${ids}` : '';
    const namesParam = names ? `&names=${names}` : '';
    const categoryParam = category ? `&category=${category}` : '';

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}${idsParam}${namesParam}${categoryParam}`
      );
      const data = await response.json();
      spinner.succeed('✅ Market data fetched successfully');
      return data;
    } catch (error) {
      spinner.fail('❌ Failed to fetch market data');
      console.error(error);
      throw error;
    }
  },
});

export default coinsMarketData;
