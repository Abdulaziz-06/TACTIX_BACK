import { Agent } from '@mastra/core/agent';
import { exaSearchTool } from '../tools/exa-search.js';
import { crawleeScrapeTool } from '../tools/crawlee-scrape.js';
import { fetchGlobalIntelligenceTool } from '../tools/tactixIntelligenceTools.js';
import { defaultModel } from '../models.js';
import { intelligenceGraphSchema } from './schemas.js';

export const marketAgent = new Agent({
  id: 'market-agent',
  name: 'Market Intelligence Service',
  instructions: `
    You are the TACTIX Market Engine.
    ANALYZE: Use exaSearch to track volatility and interest rates.
    OUTPUT: You MUST return a structured intelligence graph with nodes representing market signals (e.g. VIX spike) and financial impacts.
  `,
  model: defaultModel,
  tools: {
    exaSearch: exaSearchTool,
    crawleeScrape: crawleeScrapeTool,
    fetchMarketData: fetchGlobalIntelligenceTool,
  },
  outputs: {
    marketGraph: intelligenceGraphSchema
  }
});
