import 'dotenv/config';
import { Agent, run } from '@openai/agents';
import ora from 'ora';
import { model } from './constants';
import categorySearch from './tools/categorySearch';
import coinPlatforms from './tools/coinPlatforms';
import coinsMarketData from './tools/coinsMarketData';

const cryptoExperAgent = new Agent({
  name: 'Cryptocurrency Expert Agent',
  instructions:
    'You are a cryptocurrency expert agent that is responsible for providing information about cryptocurrencies. You should use the tools provided to you to get the information you need.',
  model: model,
  tools: [categorySearch, coinPlatforms, coinsMarketData],
});

async function main() {
  const agentSpinner = ora('🤖 Agent is thinking...').start();

  try {
    const result = await run(
      cryptoExperAgent,
      'Give me the top 10 coins by market cap on the Avalanche(AVAX) ecosystem'
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
