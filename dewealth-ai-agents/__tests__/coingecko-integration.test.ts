import { describe, expect, it, vi, beforeAll, afterAll } from 'vitest';
import plugin from '../src/plugin';
import { logger } from '@elizaos/core';
import type {
  IAgentRuntime,
  Memory,
  State,
  HandlerCallback,
} from '@elizaos/core';
import {
  createMockRuntime,
  createMockMessage,
  createMockState,
} from './utils/core-test-utils';

// Setup environment variables
beforeAll(() => {
  vi.spyOn(logger, 'info');
  vi.spyOn(logger, 'error');
  vi.spyOn(logger, 'warn');
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('Coingecko Actions Integration', () => {
  describe('GET_COIN_CATEGORIES Action', () => {
    const getCoinCategoriesAction = plugin.actions?.find(
      (action) => action.name === 'GET_COIN_CATEGORIES'
    );

    it('should successfully fetch categories from API', async () => {
      if (!getCoinCategoriesAction) {
        throw new Error('GET_COIN_CATEGORIES action not found');
      }

      const runtime = createMockRuntime();
      const mockMessage = createMockMessage(
        'Show me all cryptocurrency categories'
      );
      const mockState = createMockState();

      let callbackResponse: any = null;
      const mockCallback: HandlerCallback = async (response) => {
        callbackResponse = response;
      };

      try {
        const result = await getCoinCategoriesAction.handler(
          runtime,
          mockMessage,
          mockState,
          {},
          mockCallback,
          []
        );

        // Verify the action was called
        expect(result).toBeDefined();
        expect(result.text).toBeDefined();
        expect(result.actions).toContain('GET_COIN_CATEGORIES');

        // Verify callback was called
        expect(callbackResponse).toBeDefined();
        expect(callbackResponse.text).toBeDefined();
        expect(callbackResponse.actions).toContain('GET_COIN_CATEGORIES');

        // Verify the response contains category data
        expect(result.text).toContain('cryptocurrency categories');
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);

        // Verify we got actual category data
        if (
          result.data &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          const firstCategory = result.data[0];
          expect(firstCategory).toHaveProperty('name');
          expect(firstCategory).toHaveProperty('category_id');
        }

        logger.info('GET_COIN_CATEGORIES integration test passed');
      } catch (error) {
        logger.error('GET_COIN_CATEGORIES integration test failed:', error);
        throw error;
      }
    }, 10000); // 10 second timeout for API call
  });

  describe('GET_SPECIFIC_CATEGORY Action', () => {
    const getSpecificCategoryAction = plugin.actions?.find(
      (action) => action.name === 'GET_SPECIFIC_CATEGORY'
    );

    it('should successfully search for a specific category', async () => {
      if (!getSpecificCategoryAction) {
        throw new Error('GET_SPECIFIC_CATEGORY action not found');
      }

      const runtime = createMockRuntime();
      const mockMessage = createMockMessage('Tell me about the DeFi category');
      const mockState = createMockState();

      let callbackResponse: any = null;
      const mockCallback: HandlerCallback = async (response) => {
        callbackResponse = response;
      };

      try {
        const result = await getSpecificCategoryAction.handler(
          runtime,
          mockMessage,
          mockState,
          {},
          mockCallback,
          []
        );

        // Verify the action was called
        expect(result).toBeDefined();
        expect(result.text).toBeDefined();
        expect(result.actions).toContain('GET_SPECIFIC_CATEGORY');

        // Verify callback was called
        expect(callbackResponse).toBeDefined();
        expect(callbackResponse.text).toBeDefined();
        expect(callbackResponse.actions).toContain('GET_SPECIFIC_CATEGORY');

        // Verify the response contains relevant information
        expect(result.text).toContain('category');

        logger.info('GET_SPECIFIC_CATEGORY integration test passed');
      } catch (error) {
        logger.error('GET_SPECIFIC_CATEGORY integration test failed:', error);
        throw error;
      }
    }, 10000); // 10 second timeout for API call
  });
});
