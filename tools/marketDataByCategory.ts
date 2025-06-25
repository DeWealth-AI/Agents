import { tool } from '@openai/agents';
import ora from 'ora';
import { z } from 'zod';

const marketDataByCategory = tool({
  name: 'market_data_by_category',
  description:
    'Get the market data for all cryptocurrencies in a specific category. If only interested in a specific category pass it as a parameter. ALWAYS run check_existing_content tool first to check for existing content before using this tool. DO NOT use this tool if there is relevant existing content found.',
  parameters: z.object({
    vs_currency: z
      .string()
      .default('usd')
      .describe('The currency to use for the market data, 3 letter code'),
    category: z
      .string()
      .describe('The category of the coins we are searching for'),
  }),
  execute: async ({ vs_currency, category }) => {
    const spinner = ora('📊 Fetching market data...').start();

    const categoryParam = category ? `&category=${category}` : '';

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}${categoryParam}&order=market_cap_desc&per_page=30&page=1`
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

export default marketDataByCategory;
