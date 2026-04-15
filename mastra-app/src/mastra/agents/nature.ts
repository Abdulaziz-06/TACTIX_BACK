import { Agent } from '@mastra/core/agent';
import { exaSearchTool } from '../tools/exa-search.js';
import { crawleeScrapeTool } from '../tools/crawlee-scrape.js';
import { fetchGlobalIntelligenceTool } from '../tools/tactixIntelligenceTools.js';
import { defaultModel } from '../models.js';
import { intelligenceGraphSchema } from './schemas.js';

export const natureAgent = new Agent({
  id: 'nature-agent',
  name: 'Natural Calamity Monitor',
  instructions: `
    You are the TACTIX Calamity Monitor.
    ANALYZE: Search for global environmental disasters.
    OUTPUT: Return a structured intelligence graph showing the disaster as the root node and infrastructure impacts as downstream dependency nodes.
  `,
  model: defaultModel,
  tools: {
    exaSearch: exaSearchTool,
    crawleeScrape: crawleeScrapeTool,
    fetchNatureData: fetchGlobalIntelligenceTool,
  },
  outputs: {
    natureGraph: intelligenceGraphSchema
  }
});
