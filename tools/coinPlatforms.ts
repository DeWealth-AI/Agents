import { tool } from '@openai/agents';
import ora from 'ora';
import { z } from 'zod';
import CoingeckoPlatforms from '../types/CoingeckoPlatforms';

const coinPlatforms = tool({
  name: 'coin_platforms',
  description:
    'Get the list of coins for a given platform. Make sure to always provide a platform relevant to what the user is asking for',
  parameters: z.object({
    platform: z
      .enum([
        'ethereum',
        'avalanche',
        'base',
        'arbitrum-one',
        'polygon-pos',
        'solana',
      ])
      .describe(
        'The platform to get the coins for. Must be one of the supported platforms: ethereum, avalanche, base, arbitrum-one, polygon-pos, or solana'
      ),
  }),
  execute: async ({ platform }) => {
    const spinner = ora('📊 Fetching coin platforms...').start();

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/list?include_platform=true`
      );

      const data: CoingeckoPlatforms[] = await response.json();
      spinner.succeed('✅ Coin platforms fetched successfully');

      const filteredCoins = data.filter((coin) => coin.platforms[platform]);

      return filteredCoins;
    } catch (error) {
      spinner.fail('❌ Failed to fetch coin platforms');
      console.error(error);
      throw error;
    }
  },
});

export default coinPlatforms;
