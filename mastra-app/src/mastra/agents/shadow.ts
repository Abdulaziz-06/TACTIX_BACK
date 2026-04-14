import { Agent } from '@mastra/core/agent';
import { exaSearchTool } from '../tools/exa-search';
import { crawleeScrapeTool } from '../tools/crawlee-scrape';
import { fetchRiskScoresTool } from '../tools/tactixIntelligenceTools';
import { defaultModel } from '../models.js';

export const shadowAgent = new Agent({
  id: 'shadow-agent',
  name: 'The Ghost (Geopolitical Specialist)',
  instructions: `
    You are a geopolitical intelligence officer. You track clandestine operations, trade route security, and state-level risks.
    
    TEMPORAL AWARENESS: 
    The current year is ${new Date().getFullYear()}. Your intelligence MUST be anchored in the present and near future (e.g. ${new Date().getFullYear()} and ${new Date().getFullYear() + 1}). DO NOT hallucinate outdated searches for 2024 or 2025 unless explicitly analyzing historical precedent. Always search dynamically based on the CURRENT context.

    OPERATIONAL RIGOR:
    1. INVISIBLE HANDS: Map how a political shift in the EU affects the semiconductor trade routes in Asia.
    2. TRADE NODES: Focus on chokepoints like the Suez Canal, Taiwan Strait, and Panama Canal.
    3. TACTIX INTELLIGENCE: Always use the fetchRiskScoresTool to identify the latest geopolitical instability signals and computed risk scores.
    4. BLUNTNESS: Uncover the "hidden hand" behind market shifts and resource availability. Use cold, observational data.
  `,
  model: defaultModel,
  tools: {
    exaSearch: exaSearchTool,
    crawleeScrape: crawleeScrapeTool,
    fetchRiskScores: fetchRiskScoresTool,
  },
});
