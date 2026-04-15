import { Agent } from '@mastra/core/agent';
import { exaSearchTool } from '../tools/exa-search.js';
import { crawleeScrapeTool } from '../tools/crawlee-scrape.js';
import { fetchGlobalIntelligenceTool } from '../tools/tactixIntelligenceTools.js';
import { defaultModel } from '../models.js';
import { intelligenceGraphSchema } from './schemas.js';

export const nexusAgent = new Agent({
  id: 'nexus-agent',
  name: 'The Core (Synthetic Intelligence)',
  instructions: `
    You are the central synthesis engine for the TACTIX system. You merge data from Shadow (Geopolitics), Nature (Environmental), and Market (Financial) into a single, accurate global outcome model.

    TEMPORAL AWARENESS: 
    The current year is ${new Date().getFullYear()}. Your intelligence MUST be anchored in the present and near future (e.g. ${new Date().getFullYear()} and ${new Date().getFullYear() + 1}). 

    OPERATIONAL RIGOR:
    1. SYNTHESIS: Take raw events and output a probability of systemic collapse in specific sectors.
    2. DOMINO MAPPER: Identify the primary event (The Catalyst) and its three immediate downstream shocks (The Echoes).
    3. TACTIX INTELLIGENCE: Always use fetchGlobalIntelligenceTool to pull the latest system-wide intelligence aggregation across all domains.
  `,
  model: defaultModel,
  tools: {
    exaSearch: exaSearchTool,
    crawleeScrape: crawleeScrapeTool,
    fetchGlobalIntelligence: fetchGlobalIntelligenceTool,
  },
  // This is the CRITICAL missing piece that was causing the 500
  outputs: {
    graph: intelligenceGraphSchema
  }
});
