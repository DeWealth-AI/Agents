import type { Plugin } from '@elizaos/core';
import {
  type Action,
  type Content,
  type GenerateTextParams,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  ModelType,
  type Provider,
  type ProviderResult,
  Service,
  type State,
  logger,
} from '@elizaos/core';
import { z } from 'zod';
import coingeckoActions from './actions/Coingecko';

/**
 * Define the configuration schema for the plugin with the following properties:
 *
 * @param {string} EXAMPLE_PLUGIN_VARIABLE - The name of the plugin (min length of 1, optional)
 * @returns {object} - The configured schema object
 */
const configSchema = z.object({
  EXAMPLE_PLUGIN_VARIABLE: z
    .string()
    .min(1, 'Example plugin variable is not provided')
    .optional()
    .transform((val) => {
      if (!val) {
        console.warn('Warning: Example plugin variable is not provided');
      }
      return val;
    }),
});

/**
 * Example HelloWorld action
 * This demonstrates the simplest possible action structure
 */
/**
 * Represents an action that responds with a simple hello world message.
 *
 * @typedef {Object} Action
 * @property {string} name - The name of the action
 * @property {string[]} similes - The related similes of the action
 * @property {string} description - Description of the action
 * @property {Function} validate - Validation function for the action
 * @property {Function} handler - The function that handles the action
 * @property {Object[]} examples - Array of examples for the action
 */
const helloWorldAction: Action = {
  name: 'HELLO_WORLD',
  similes: ['GREET', 'SAY_HELLO'],
  description: 'Responds with a simple hello world message',

  validate: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State
  ): Promise<boolean> => {
    // Always valid
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
      logger.info('Handling HELLO_WORLD action');

      // Simple response content
      const responseContent: Content = {
        text: 'hello world!',
        actions: ['HELLO_WORLD'],
        source: message.content.source,
      };

      // Call back with the hello world message
      await callback(responseContent);

      return responseContent;
    } catch (error) {
      logger.error('Error in HELLO_WORLD action:', error);
      throw error;
    }
  },

  examples: [
    [
      {
        name: '{{name1}}',
        content: {
          text: 'Can you say hello?',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: 'hello world!',
          actions: ['HELLO_WORLD'],
        },
      },
    ],
  ],
};

/**
 * Example Hello World Provider
 * This demonstrates the simplest possible provider implementation
 */
const helloWorldProvider: Provider = {
  name: 'HELLO_WORLD_PROVIDER',
  description: 'A simple example provider',

  get: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State
  ): Promise<ProviderResult> => {
    return {
      text: 'I am a provider',
      values: {},
      data: {},
    };
  },
};

export class StarterService extends Service {
  static serviceType = 'starter';
  capabilityDescription =
    'This is a starter service which is attached to the agent through the starter plugin.';

  constructor(runtime: IAgentRuntime) {
    super(runtime);
  }

  static async start(runtime: IAgentRuntime) {
    logger.info('*** Starting starter service ***');
    const service = new StarterService(runtime);

    // Set up message bus monitoring
    logger.info('*** Setting up message bus monitoring ***');

    return service;
  }

  static async stop(runtime: IAgentRuntime) {
    logger.info('*** Stopping starter service ***');
    // get the service from the runtime
    const service = runtime.getService(StarterService.serviceType);
    if (!service) {
      throw new Error('Starter service not found');
    }
    service.stop();
  }

  async stop() {
    logger.info('*** Stopping starter service instance ***');
  }

  // Add method to get message bus status
  async getMessageBusStatus() {
    logger.info('*** Getting message bus status ***');
    return {
      serviceType: StarterService.serviceType,
      status: 'active',
      timestamp: new Date().toISOString(),
    };
  }
}

const plugin: Plugin = {
  name: 'starter',
  description: 'A starter plugin for Eliza',
  // Set lowest priority so real models take precedence
  priority: -1000,
  config: {
    EXAMPLE_PLUGIN_VARIABLE: process.env.EXAMPLE_PLUGIN_VARIABLE,
  },
  async init(config: Record<string, string>) {
    logger.info('*** Initializing starter plugin ***');
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      // Set all environment variables at once
      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid plugin configuration: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw error;
    }
  },
  models: {
    [ModelType.TEXT_SMALL]: async (
      _runtime,
      { prompt, stopSequences = [] }: GenerateTextParams
    ) => {
      return 'Never gonna give you up, never gonna let you down, never gonna run around and desert you...';
    },
    [ModelType.TEXT_LARGE]: async (
      _runtime,
      {
        prompt,
        stopSequences = [],
        maxTokens = 8192,
        temperature = 0.7,
        frequencyPenalty = 0.7,
        presencePenalty = 0.7,
      }: GenerateTextParams
    ) => {
      return 'Never gonna make you cry, never gonna say goodbye, never gonna tell a lie and hurt you...';
    },
  },
  routes: [
    {
      name: 'helloworld',
      path: '/helloworld',
      type: 'GET',
      handler: async (_req: any, res: any) => {
        // send a response
        res.json({
          message: 'Hello World!',
        });
      },
    },
    {
      name: 'messagebus-status',
      path: '/messagebus-status',
      type: 'GET',
      handler: async (req: any, res: any) => {
        logger.info('*** Message bus status requested ***');
        res.json({
          message: 'Message bus status',
          timestamp: new Date().toISOString(),
          status: 'active',
          info: 'Use this endpoint to check message bus status. Check logs for detailed message flow.',
        });
      },
    },
    {
      name: 'debug-actions',
      path: '/debug-actions',
      type: 'GET',
      handler: async (req: any, res: any) => {
        logger.info('*** Debug actions requested ***');
        res.json({
          message: 'Available actions for debugging',
          actions: [
            'GET_COIN_CATEGORIES',
            'GET_SPECIFIC_CATEGORY',
            'TEST_ACTION',
            'HELLO_WORLD',
          ],
          info: 'These actions are available in the plugin. Check logs for execution details.',
        });
      },
    },
  ],
  events: {
    MESSAGE_RECEIVED: [
      async (params) => {
        logger.info('MESSAGE_RECEIVED event received');
        logger.info('Message parameters keys:', Object.keys(params));

        // Log detailed message information
        if (params.message) {
          logger.info('Message ID:', params.message.id || 'No ID');
          logger.info(
            'Message content:',
            JSON.stringify(params.message.content, null, 2)
          );
          logger.info(
            'Message source:',
            params.message.content?.source || 'No source'
          );
          logger.info(
            'Message actions:',
            params.message.content?.actions || 'No actions'
          );
        }

        if (params.runtime) {
          logger.info('Runtime available:', !!params.runtime);
          logger.info(
            'Runtime actions count:',
            params.runtime.actions?.length || 0
          );
        }

        // Safely serialize params without circular references
        try {
          const safeParams = {
            message: params.message
              ? {
                  id: params.message.id,
                  content: params.message.content,
                }
              : null,
            source: params.source,
            runtime: params.runtime
              ? {
                  hasActions: !!params.runtime.actions,
                  actionsCount: params.runtime.actions?.length || 0,
                }
              : null,
          };
          logger.info(
            'Full params structure:',
            JSON.stringify(safeParams, null, 2)
          );
        } catch (error) {
          logger.info(
            'Could not serialize full params due to circular reference'
          );
        }
      },
    ],
    VOICE_MESSAGE_RECEIVED: [
      async (params) => {
        logger.info('VOICE_MESSAGE_RECEIVED event received');
        logger.info('Voice message parameters keys:', Object.keys(params));
        try {
          const safeParams = {
            message: params.message
              ? {
                  id: params.message.id,
                  content: params.message.content,
                }
              : null,
            source: params.source,
            runtime: params.runtime
              ? {
                  hasActions: !!params.runtime.actions,
                  actionsCount: params.runtime.actions?.length || 0,
                }
              : null,
          };
          logger.info(
            'Voice message content:',
            JSON.stringify(safeParams, null, 2)
          );
        } catch (error) {
          logger.info(
            'Could not serialize voice message params due to circular reference'
          );
        }
      },
    ],
    WORLD_CONNECTED: [
      async (params) => {
        logger.info('WORLD_CONNECTED event received');
        logger.info('World connection parameters keys:', Object.keys(params));
        try {
          const safeParams = {
            world: params.world
              ? {
                  id: params.world.id,
                  name: params.world.name,
                }
              : null,
            rooms: params.rooms?.length || 0,
            entities: params.entities?.length || 0,
            source: params.source,
            runtime: params.runtime
              ? {
                  hasActions: !!params.runtime.actions,
                  actionsCount: params.runtime.actions?.length || 0,
                }
              : null,
          };
          logger.info(
            'World connection details:',
            JSON.stringify(safeParams, null, 2)
          );
        } catch (error) {
          logger.info(
            'Could not serialize world connection params due to circular reference'
          );
        }
      },
    ],
    WORLD_JOINED: [
      async (params) => {
        logger.info('WORLD_JOINED event received');
        logger.info('World join parameters keys:', Object.keys(params));
        try {
          const safeParams = {
            world: params.world
              ? {
                  id: params.world.id,
                  name: params.world.name,
                }
              : null,
            entity: (params as any).entity
              ? {
                  id: (params as any).entity.id,
                  name: (params as any).entity.name,
                }
              : null,
            rooms: params.rooms?.length || 0,
            entities: params.entities?.length || 0,
            source: params.source,
            runtime: params.runtime
              ? {
                  hasActions: !!params.runtime.actions,
                  actionsCount: params.runtime.actions?.length || 0,
                }
              : null,
          };
          logger.info(
            'World join details:',
            JSON.stringify(safeParams, null, 2)
          );
        } catch (error) {
          logger.info(
            'Could not serialize world join params due to circular reference'
          );
        }
      },
    ],
    ACTION_EXECUTED: [
      async (params) => {
        logger.info('ACTION_EXECUTED event received');
        logger.info('Action execution parameters keys:', Object.keys(params));
        logger.info('Action name:', params.actionName || 'No action name');
        logger.info('Action result:', JSON.stringify(params.result, null, 2));
        logger.info(
          'Action execution details:',
          JSON.stringify(params, null, 2)
        );
      },
    ],
    MESSAGE_SENT: [
      async (params) => {
        logger.info('MESSAGE_SENT event received');
        logger.info('Message sent parameters keys:', Object.keys(params));
        logger.info(
          'Sent message content:',
          JSON.stringify(params.message?.content, null, 2)
        );
        logger.info('Sent message details:', JSON.stringify(params, null, 2));
      },
    ],
  },
  services: [StarterService],
  actions: [helloWorldAction, ...coingeckoActions],
  providers: [helloWorldProvider],
};

export default plugin;
