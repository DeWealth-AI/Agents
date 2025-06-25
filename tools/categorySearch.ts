import { tool } from '@openai/agents';
import ora from 'ora';
import { z } from 'zod';
import CoingeckoCategories from '../types/CoingeckoCategories';

const categorySearch = tool({
  name: 'category_search',
  description:
    'Get the list of cryptocurrency categories. Make sure to always provide a list of keywords specific to what the user is asking for. This keyword will be specifically used to filter the categories using includes method on its name and category_id. ALWAYS run check_existing_content tool first to check for existing content before using this tool. DO NOT use this tool if there is relevant existing content found.',
  parameters: z.object({}),
  execute: async () => {
    const spinner = ora('🔍 Fetching cryptocurrency categories...').start();

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/categories/list`
      );
      const data: CoingeckoCategories[] = await response.json();
      spinner.succeed('✅ Categories fetched successfully');
      return data;
    } catch (error) {
      spinner.fail('❌ Failed to fetch categories');
      console.error(error);
      throw error;
    }
  },
});

export default categorySearch;
