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

describe('Coingecko Actions', () => {
  it('should have Coingecko actions registered in the plugin', () => {
    expect(plugin.actions).toBeDefined();
    expect(Array.isArray(plugin.actions)).toBe(true);

    const actionNames = plugin.actions?.map((action) => action.name) || [];
    expect(actionNames).toContain('GET_COIN_CATEGORIES');
    expect(actionNames).toContain('GET_SPECIFIC_CATEGORY');
  });

  it('should have HELLO_WORLD action still registered', () => {
    const actionNames = plugin.actions?.map((action) => action.name) || [];
    expect(actionNames).toContain('HELLO_WORLD');
  });

  describe('GET_COIN_CATEGORIES Action', () => {
    const getCoinCategoriesAction = plugin.actions?.find(
      (action) => action.name === 'GET_COIN_CATEGORIES'
    );

    it('should exist and have correct structure', () => {
      expect(getCoinCategoriesAction).toBeDefined();
      if (getCoinCategoriesAction) {
        expect(getCoinCategoriesAction).toHaveProperty(
          'name',
          'GET_COIN_CATEGORIES'
        );
        expect(getCoinCategoriesAction).toHaveProperty('description');
        expect(getCoinCategoriesAction).toHaveProperty('similes');
        expect(getCoinCategoriesAction).toHaveProperty('validate');
        expect(getCoinCategoriesAction).toHaveProperty('handler');
        expect(getCoinCategoriesAction).toHaveProperty('examples');
      }
    });

    it('should have appropriate similes', () => {
      if (getCoinCategoriesAction) {
        const similes = getCoinCategoriesAction.similes || [];
        expect(similes).toContain('LIST_CATEGORIES');
        expect(similes).toContain('GET_ALL_CATEGORIES');
        expect(similes).toContain('COIN_CATEGORIES');
        expect(similes).toContain('CRYPTO_CATEGORIES');
      }
    });

    it('should validate successfully', async () => {
      if (getCoinCategoriesAction) {
        const runtime = createMockRuntime();
        const mockMessage = createMockMessage('Show me all categories');
        const mockState = createMockState();

        const result = await getCoinCategoriesAction.validate(
          runtime,
          mockMessage,
          mockState
        );
        expect(result).toBe(true);
      }
    });
  });

  describe('GET_SPECIFIC_CATEGORY Action', () => {
    const getSpecificCategoryAction = plugin.actions?.find(
      (action) => action.name === 'GET_SPECIFIC_CATEGORY'
    );

    it('should exist and have correct structure', () => {
      expect(getSpecificCategoryAction).toBeDefined();
      if (getSpecificCategoryAction) {
        expect(getSpecificCategoryAction).toHaveProperty(
          'name',
          'GET_SPECIFIC_CATEGORY'
        );
        expect(getSpecificCategoryAction).toHaveProperty('description');
        expect(getSpecificCategoryAction).toHaveProperty('similes');
        expect(getSpecificCategoryAction).toHaveProperty('validate');
        expect(getSpecificCategoryAction).toHaveProperty('handler');
        expect(getSpecificCategoryAction).toHaveProperty('examples');
      }
    });

    it('should have appropriate similes', () => {
      if (getSpecificCategoryAction) {
        const similes = getSpecificCategoryAction.similes || [];
        expect(similes).toContain('FIND_CATEGORY');
        expect(similes).toContain('SEARCH_CATEGORY');
        expect(similes).toContain('GET_CATEGORY_INFO');
        expect(similes).toContain('SPECIFIC_CATEGORY');
      }
    });

    it('should validate successfully', async () => {
      if (getSpecificCategoryAction) {
        const runtime = createMockRuntime();
        const mockMessage = createMockMessage('Tell me about DeFi category');
        const mockState = createMockState();

        const result = await getSpecificCategoryAction.validate(
          runtime,
          mockMessage,
          mockState
        );
        expect(result).toBe(true);
      }
    });
  });
});
