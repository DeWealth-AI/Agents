import { openai } from '@ai-sdk/openai';
import { aisdk } from '@openai/agents-extensions';

export const model = aisdk(openai('gpt-4o-mini'));
