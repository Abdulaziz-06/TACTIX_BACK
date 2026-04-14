import './env-init.js';
import { Mastra } from '@mastra/core';
import { marketAgent } from './agents/market';
import { natureAgent } from './agents/nature';
import { shadowAgent } from './agents/shadow';
import { nexusAgent } from './agents/nexus';
import { globeAgent } from './agents/globe';
import { intelligenceWorkflow } from './workflows/intelligence';

export const mastra = new Mastra({
  agents: {
    marketAgent,
    natureAgent,
    shadowAgent,
    nexusAgent,
    globeAgent
  },
  workflows: {
    intelligenceWorkflow
  },
});
