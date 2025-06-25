import { tool } from '@openai/agents';
import { z } from 'zod';
import ora from 'ora';
import { pc } from '../constants';

// Tool to check for existing content in the database
export const checkExistingContent = tool({
  name: 'check_existing_content',
  description:
    'Check if there is existing content in the database related to a specific topic with high similarity score. ALWAYS run this tool first out of all the other tools to check for existing content',
  parameters: z.object({
    topic: z.string().describe('The topic to search for in the database'),
    limit: z
      .number()
      .default(2)
      .describe('Maximum number of results to return'),
  }),
  execute: async ({ topic, limit }) => {
    const spinner = ora('🔍 Checking for existing content...').start();

    try {
      const index = pc.index('cryptocurrency-expert-agent');

      // Query the database
      const queryResult = await index.searchRecords({
        query: {
          topK: limit,
          inputs: { text: topic },
        },
      });

      // Filter results by threshold
      const relevantResults = queryResult.result?.hits || [];

      if (relevantResults.length > 0) {
        spinner.succeed(
          `✅ Found ${relevantResults.length} relevant existing content items`
        );
      } else {
        spinner.succeed('✅ No relevant existing content found');
      }

      return {
        found: relevantResults.length > 0,
        count: relevantResults.length,
        results: relevantResults.map((match) => ({
          id: match._id,
          score: match._score,
          metadata: match.fields,
        })),
        topic: topic,
        threshold: 0.4,
      };
    } catch (error) {
      spinner.fail('❌ Failed to check existing content');
      console.error('Error checking existing content:', error);
      throw error;
    }
  },
});

// Tool to upsert content to the database
export const upsertContent = tool({
  name: 'upsert_content',
  description:
    'Upsert content to the database with metadata for future retrieval. Before passing in content, make sure you format it in JSON format in a way that is easy to parse and understand.',
  parameters: z.object({
    content: z.string().describe('The content to store in the database'),
    topic: z.string().describe('The main topic of the content'),
    source: z
      .string()
      .default('agent_response')
      .describe('Source of the content'),
    metadata: z
      .record(z.any())
      .default({})
      .describe('Additional metadata to store'),
  }),
  execute: async ({ content, topic, source, metadata = {} }) => {
    const spinner = ora('💾 Storing content in database...').start();

    try {
      const index = pc.index('cryptocurrency-expert-agent').namespace(topic);
      // Generate a unique ID
      const id = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Prepare metadata
      const fullMetadata = {
        id: id,
        chunk_text: content,
        topic: topic,
        source: source,
        timestamp: new Date().toISOString(),
        ...metadata,
      };

      // Upsert to database
      await index.upsertRecords([fullMetadata]);

      spinner.succeed(`✅ Content stored successfully (ID: ${id})`);

      return {
        success: true,
        id: id,
        topic: topic,
        content_length: content.length,
        timestamp: fullMetadata.timestamp,
      };
    } catch (error) {
      spinner.fail('❌ Failed to store content in database');
      console.error('Error upserting content:', error);
      throw error;
    }
  },
});
