import { tool } from '@openai/agents';
import ora from 'ora';
import { z } from 'zod';

const categorySearch = tool({
  name: 'category_search',
  description: 'Get the list of cryptocurrency categories',
  parameters: z.object({}),
  execute: async () => {
    const spinner = ora('🔍 Fetching cryptocurrency categories...').start();

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/categories/`
      );
      const data = await response.json();
      spinner.succeed('✅ Categories fetched successfully');
      return data;
    } catch (error) {
      spinner.fail('❌ Failed to fetch categories');
      throw error;
    }
  },
});

export default categorySearch;
