import { Agent } from '@mastra/core/agent';
import { z } from 'zod';
import { exaSearchTool } from '../tools/exa-search.js';
import { crawleeScrapeTool } from '../tools/crawlee-scrape.js';
import { fetchGlobalIntelligenceTool } from '../tools/tactixIntelligenceTools.js';
import { defaultModel } from '../models.js';

export const GlobalMapSchema = z.object({
  countries: z.array(z.object({
    name: z.string(),
    isoCode: z.string(),
    conflictStatus: z.enum(['STABLE', 'MONITORED', 'TENSION', 'CONFLICT', 'CRITICAL']),
    headline: z.string(),
    summary: z.string(),
    riskScore: z.number(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    })
  }))
});

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
