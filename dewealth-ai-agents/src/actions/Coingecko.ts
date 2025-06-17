import {
  type Action,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  logger,
  type Content,
  type State,
} from '@elizaos/core';
import axios, { AxiosResponse } from 'axios';
import type { CoinCategory } from '@/types/CoingeckoCategories';

const getCoinCategories: Action = {
  name: 'GET_COIN_CATEGORIES',
  description: 'Get the full list of coin categories from coingecko',
  similes: [
    'LIST_CATEGORIES',
    'SHOW_CATEGORIES',
    'GET_ALL_CATEGORIES',
    'VIEW_CATEGORIES',
  ],

  validate: async (
    _runtime: IAgentRuntime,
    message: Memory,
    state?: State
  ): Promise<boolean> => {
    return true;
  },

  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    state: State | undefined,
    _options: any,
    callback: HandlerCallback | undefined,
    responses: Memory[] | undefined
  ) => {
    try {
      logger.info('Handling GET_COIN_CATEGORIES action');

      const response: AxiosResponse<CoinCategory[]> = await axios.get(
        'https://api.coingecko.com/api/v3/coins/categories/list'
      );

      const categories = response.data;
      const responseText = `Here are all available cryptocurrency categories:\n${categories
        .map((cat) => `- ${cat.name} (ID: ${cat.category_id})`)
        .join('\n')}`;

      const responseContent: Content = {
        text: responseText,
        actions: ['GET_COIN_CATEGORIES'],
        source: message.content.source,
        data: categories,
      };

      if (callback) {
        await callback(responseContent);
      }

      return responseContent;
    } catch (error) {
      logger.error('Error in GET_COIN_CATEGORIES action:', error);
      throw error;
    }
  },

  examples: [
    [
      {
        name: '{{name1}}',
        content: {
          text: 'What cryptocurrency categories are available?',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: 'Here are all available cryptocurrency categories:\n- DeFi (ID: defi)\n- NFT (ID: nft)\n...',
          actions: ['GET_COIN_CATEGORIES'],
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: 'Show me all coin categories',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: 'Here are all available cryptocurrency categories:\n- DeFi (ID: defi)\n- NFT (ID: nft)\n...',
          actions: ['GET_COIN_CATEGORIES'],
        },
      },
    ],
  ],
};

const getSpecificCategory: Action = {
  name: 'GET_SPECIFIC_CATEGORY',
  description: 'Get information about a specific coin category',
  similes: [
    'FIND_CATEGORY',
    'SEARCH_CATEGORY',
    'LOOKUP_CATEGORY',
    'GET_CATEGORY_INFO',
  ],

  validate: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State
  ): Promise<boolean> => {
    return true;
  },

  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    state: State | undefined,
    _options: any,
    callback: HandlerCallback | undefined,
    responses: Memory[] | undefined
  ) => {
    try {
      logger.info('Handling GET_SPECIFIC_CATEGORY action');

      // Extract the category name from the message
      const categoryQuery = message.content.text?.toLowerCase() || '';

      // Get all categories
      const response: AxiosResponse<CoinCategory[]> = await axios.get(
        'https://api.coingecko.com/api/v3/coins/categories/list'
      );
      const categories = response.data;

      // Find matching category
      const matchingCategory = categories.find(
        (category: CoinCategory) =>
          category.name.toLowerCase().includes(categoryQuery) ||
          category.category_id.toLowerCase().includes(categoryQuery)
      );

      let responseText: string;
      if (matchingCategory) {
        responseText = `I found the category you're looking for:\nName: ${matchingCategory.name}\nID: ${matchingCategory.category_id}`;
      } else {
        responseText = `I couldn't find any category matching "${categoryQuery}". Would you like to see the full list of available categories?`;
      }

      const responseContent: Content = {
        text: responseText,
        actions: ['GET_SPECIFIC_CATEGORY'],
        source: message.content.source,
        data: matchingCategory || null,
      };

      if (callback) {
        await callback(responseContent);
      }

      return responseContent;
    } catch (error) {
      logger.error('Error in GET_SPECIFIC_CATEGORY action:', error);
      throw error;
    }
  },

  examples: [
    [
      {
        name: '{{name1}}',
        content: {
          text: 'Tell me about the DeFi category',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: "I found the category you're looking for:\nName: DeFi\nID: defi",
          actions: ['GET_SPECIFIC_CATEGORY'],
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: 'What is the NFT category?',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: "I found the category you're looking for:\nName: NFT\nID: nft",
          actions: ['GET_SPECIFIC_CATEGORY'],
        },
      },
    ],
  ],
};

export default [getCoinCategories, getSpecificCategory];
