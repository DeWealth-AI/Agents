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
import type { CoinCategory } from '../types/CoingeckoCategories';
import { v4 as uuidv4 } from 'uuid';

const getCoinCategories: Action = {
  name: 'GET_COIN_CATEGORIES',
  description: 'Get the full list of coin categories from coingecko',
  similes: [
    'LIST_CATEGORIES',
    'SHOW_CATEGORIES',
    'GET_ALL_CATEGORIES',
    'VIEW_CATEGORIES',
    'COIN_CATEGORIES',
    'CRYPTO_CATEGORIES',
    'CATEGORIES_LIST',
    'SHOW_ALL_CATEGORIES',
    'GET_CATEGORIES',
    'LIST_ALL_CATEGORIES',
  ],

  validate: async (
    _runtime: IAgentRuntime,
    message: Memory,
    state?: State
  ): Promise<boolean> => {
    return true;
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: any,
    callback: HandlerCallback,
    _responses: Memory[]
  ) => {
    try {
      logger.info('Handling GET_COIN_CATEGORIES action');

      const responseContent: Content = {
        text: 'I am fetching the list of categories from CoinGecko. This may take a few seconds...',
        actions: ['GET_COIN_CATEGORIES'],
        source: message.content.source,
        thought: 'I am fetching the list of categories from CoinGecko.',
      };

      // this is the initial message that is sent to the user
      if (callback) {
        await callback(responseContent);
        logger.info('GET_COIN_CATEGORIES callback called');
      }

      const response: AxiosResponse<CoinCategory[]> = await axios.get(
        'https://api.coingecko.com/api/v3/coins/categories/list'
      );
      const categories = response.data;

      // Create a more concise response to avoid potential issues with very long responses
      const categoryList = categories
        .slice(0, 10)
        .map((cat) => `- ${cat.name} (ID: ${cat.category_id})`)
        .join('\n');
      const responseText = `I've fetched the complete list of cryptocurrency categories from CoinGecko. Here are the first 10 categories:\n${categoryList}\n\nThere are ${categories.length} total categories available. The full data has been loaded and is ready for you to explore.`;

      await runtime.createMemory(
        {
          id: uuidv4() as `${string}-${string}-${string}-${string}-${string}`,
          content: {
            text: responseText,
          },
          agentId: runtime.agentId,
          entityId: message.entityId,
          roomId: message.roomId,
        },
        'messages'
      );

      return true;
    } catch (error) {
      logger.error('Error in GET_COIN_CATEGORIES action:', error);

      const errorContent: Content = {
        text: 'I encountered an error while fetching cryptocurrency categories. Please try again.',
        actions: ['GET_COIN_CATEGORIES'],
        source: message.content.source,
      };

      if (callback) {
        callback(errorContent);
      }

      return errorContent;
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
    'SPECIFIC_CATEGORY',
    'CATEGORY_INFO',
    'FIND_SPECIFIC_CATEGORY',
    'SEARCH_SPECIFIC_CATEGORY',
    'LOOKUP_SPECIFIC_CATEGORY',
    'GET_CATEGORY_DETAILS',
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
    _state: State,
    _options: any,
    callback: HandlerCallback,
    _responses: Memory[]
  ) => {
    try {
      logger.info('Handling GET_SPECIFIC_CATEGORY action');

      // Extract the category name from the message
      const categoryQuery = message.content.text?.toLowerCase() || '';
      logger.info('Searching for category:', categoryQuery);

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
        logger.info('Found matching category:', matchingCategory.name);
      } else {
        responseText = `I couldn't find any category matching "${categoryQuery}". Would you like to see the full list of available categories?`;
        logger.info('No matching category found for query:', categoryQuery);
      }

      const responseContent: Content = {
        text: responseText,
        actions: ['GET_SPECIFIC_CATEGORY'],
        source: message.content.source,
        data: matchingCategory || null,
      };

      logger.info('GET_SPECIFIC_CATEGORY response content:', {
        textLength: responseText.length,
        hasCallback: !!callback,
        actions: responseContent.actions,
      });

      // Call back with the response (following HELLO_WORLD pattern)
      await callback(responseContent);

      logger.info('GET_SPECIFIC_CATEGORY action completed successfully');
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

const testAction: Action = {
  name: 'TEST_ACTION',
  description: 'A simple test action that returns a basic response',
  similes: ['TEST', 'SIMPLE_TEST', 'BASIC_TEST'],

  validate: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State
  ): Promise<boolean> => {
    return true;
  },

  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: any,
    callback: HandlerCallback,
    _responses: Memory[]
  ) => {
    try {
      logger.info('Handling TEST_ACTION');

      const responseText =
        'This is a test response from the TEST_ACTION. If you see this, the action system is working!';

      const responseContent: Content = {
        text: responseText,
        actions: ['TEST_ACTION'],
        source: message.content.source,
      };

      logger.info('TEST_ACTION response content:', {
        textLength: responseText.length,
        hasCallback: !!callback,
        actions: responseContent.actions,
      });

      // Call back with the test message (following HELLO_WORLD pattern)
      await callback(responseContent);

      logger.info('TEST_ACTION completed successfully');
      return responseContent;
    } catch (error) {
      logger.error('Error in TEST_ACTION:', error);
      throw error;
    }
  },

  examples: [
    [
      {
        name: '{{name1}}',
        content: {
          text: 'Test the action system',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: 'This is a test response from the TEST_ACTION. If you see this, the action system is working!',
          actions: ['TEST_ACTION'],
        },
      },
    ],
  ],
};

export default [getCoinCategories, getSpecificCategory, testAction];
