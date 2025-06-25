import { openai } from '@ai-sdk/openai';
import { aisdk } from '@openai/agents-extensions';
import { Pinecone } from '@pinecone-database/pinecone';

export const model = aisdk(openai('gpt-4o-mini'));
export const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
