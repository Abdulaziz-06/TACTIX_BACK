import './env-init.js';
import { Mastra } from '@mastra/core';
import { marketAgent } from './agents/market.js';
import { natureAgent } from './agents/nature.js';
import { shadowAgent } from './agents/shadow.js';
import { nexusAgent } from './agents/nexus.js';
import { globeAgent } from './agents/globe.js';
import { intelligenceWorkflow } from './workflows/intelligence.js';

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
