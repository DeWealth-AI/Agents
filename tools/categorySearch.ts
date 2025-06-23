import { tool } from '@openai/agents';
import ora from 'ora';
import { z } from 'zod';
import CoingeckoCategories from '../types/CoingeckoCategories';

const categorySearch = tool({
  name: 'category_search',
  description:
    'Get the list of cryptocurrency categories. Make sure to always provide a list of keywords specific to what the user is asking for. This keyword will be specifically used to filter the categories using includes method on its name and category_id',
  parameters: z.object({
    keywords: z
      .string()
      .describe('Comma separated list of keywords to search for'),
  }),
  execute: async ({ keywords }) => {
    const spinner = ora('🔍 Fetching cryptocurrency categories...').start();

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/categories/list`
      );
      console.log('[DEBUG] URL: ', response.url);
      const data: CoingeckoCategories[] = await response.json();
      spinner.succeed('✅ Categories fetched successfully');

      const keywordsArray = keywords.split(',');
      const filteredCategories = data.filter((category) => {
        return keywordsArray.some(
          (keyword) =>
            category.name.toLowerCase().includes(keyword.toLowerCase()) ||
            category.category_id.toLowerCase().includes(keyword.toLowerCase())
        );
      });

      console.log('[DEBUG] Filtered categories: ', filteredCategories);

      return filteredCategories;
    } catch (error) {
      spinner.fail('❌ Failed to fetch categories');
      console.error(error);
      throw error;
    }
  },
});

export default categorySearch;
