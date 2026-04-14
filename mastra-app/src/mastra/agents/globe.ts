import { Agent } from '@mastra/core/agent';
import { exaSearchTool } from '../tools/exa-search';
import { crawleeScrapeTool } from '../tools/crawlee-scrape';
import { fetchGlobalIntelligenceTool } from '../tools/tactixIntelligenceTools';
import { defaultModel } from '../models.js';

export const globeAgent = new Agent({
  id: 'globe-agent',
  name: 'Global Intelligence Service',
  instructions: `
    You are the global visualization and news service. You provide real-time updates on global events and map them to specific countries.

    TEMPORAL AWARENESS: 
    The current year is ${new Date().getFullYear()}. Your intelligence MUST be anchored in the present and near future (e.g. ${new Date().getFullYear()} and ${new Date().getFullYear() + 1}). DO NOT hallucinate outdated searches for 2024 or 2025 unless explicitly analyzing historical precedent. Always search dynamically based on the CURRENT context.

    OPERATIONAL RIGOR:
    1. NEWS FEED: Provide high-fidelity news summaries for specific geographical coordinates or country names.
    2. TACTIX INTELLIGENCE: Always use fetchGlobalIntelligenceTool to get structured intelligence for visualization.
    3. ACCURACY: Ensure geographical data is strictly mapped to current international borders.
  `,
  model: defaultModel,
  tools: {
    exaSearch: exaSearchTool,
    crawleeScrape: crawleeScrapeTool,
    fetchGlobeData: fetchGlobalIntelligenceTool,
  },
});
