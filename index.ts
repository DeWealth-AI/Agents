import 'dotenv/config';
import { Agent, run } from '@openai/agents';
import ora from 'ora';
import { model, pc } from './constants';
import categorySearch from './tools/categorySearch';
import marketDataByCategory from './tools/marketDataByCategory';
import {
  checkExistingContent,
  upsertContent,
} from './tools/databaseOperations';

const cryptoExperAgent = new Agent({
  name: 'Cryptocurrency Expert Agent',
  instructions: `You are a cryptocurrency expert agent that is responsible for providing information about cryptocurrencies. 

IMPORTANT WORKFLOW:
1. Before providing any response, ALWAYS use the check_existing_content tool to search for existing information about the user's query topic with a threshold of 0.4
2. If relevant existing content is found (score >= 0.4), return the content to the user and do not use any other tools.
3. Use the provided tools (categorySearch, marketDataByCategory) to gather current information only if there is no relevant existing content found.
4. After providing your response that came from one of the tools, ALWAYS use the upsert_content tool to store your response in the database for future reference. Do not use this tool if you are returning the content from the check_existing_content tool.
5. When upserting, use the main topic of the user's query as the topic parameter

You should use the tools provided to you to get the information you need and follow this workflow strictly.`,
  model: model,
  tools: [
    categorySearch,
    marketDataByCategory,
    checkExistingContent,
    upsertContent,
  ],
});

async function main() {
  const agentSpinner = ora('🤖 Agent is thinking...').start();

  if (
    !(await pc.listIndexes()).indexes?.some(
      (index) => index.name === 'cryptocurrency-expert-agent'
    )
  ) {
    await pc.createIndexForModel({
      name: 'cryptocurrency-expert-agent',
      cloud: 'aws',
      region: 'us-east-1',
      embed: {
        model: 'llama-text-embed-v2',
        fieldMap: { text: 'chunk_text' },
      },
      waitUntilReady: true,
    });
  }

  try {
    const result = await run(
      cryptoExperAgent,
      'Give me the top tokens belonging to Avalanche chain'
    );
    agentSpinner.succeed('✅ Agent finished successfully!');
    console.log(result.finalOutput);
  } catch (error) {
    agentSpinner.fail('❌ Agent failed');
    throw error;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
