import 'dotenv/config';
import { Agent, run } from '@openai/agents';
import categorySearch from './tools/categorySearch';
import coinsMarketData from './tools/coinsMarketData';
import { aisdk } from '@openai/agents-extensions';
import { openai } from '@ai-sdk/openai';
import ora from 'ora';

const model = aisdk(openai('gpt-4o-mini'));

const agent = new Agent({
  name: 'Cryptocurrency Expert',
  instructions:
    'You provide assistance with anything crypto related such as background summaries, cryptocurrency categories, best coins within an ecosystem.',
  tools: [categorySearch, coinsMarketData],
  model,
});

async function main() {
  const agentSpinner = ora('🤖 Agent is thinking...').start();

  try {
    const result = await run(agent, 'Give me top 3 coins by market cap');
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
