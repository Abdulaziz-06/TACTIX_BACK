import { Mastra } from '@mastra/core';
import { marketAgent } from './agents/market';
import { natureAgent } from './agents/nature';
import { shadowAgent } from './agents/shadow';
import { nexusAgent } from './agents/nexus';
import { intelligenceWorkflow } from './workflows/intelligence';

// Alias GOOGLE_API_KEY to what AI-SDK/Mastra expects
if (process.env.GOOGLE_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_API_KEY;
}

export const mastra = new Mastra({
  agents: { 
    marketAgent, 
    natureAgent, 
    shadowAgent, 
    nexusAgent 
  },
  workflows: { 
    intelligenceWorkflow 
  },
});
