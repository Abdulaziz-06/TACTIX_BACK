import { Agent } from '@mastra/core/agent';
import { z } from 'zod';
import { exaSearchTool } from '../tools/exa-search';
import { crawleeScrapeTool } from '../tools/crawlee-scrape';

// Graph Schema Definition for Structured Output
export const NodeSchema = z.object({
  id: z.string().describe("Unique descriptive ID (e.g. 'soil_depletion')"),
  label: z.string().describe("Short title (e.g. 'Soil Depletion In Asia')"),
  description: z.string().describe("Natural language description of the node"),
  type: z.enum(['SIGNAL', 'DEPENDENCY', 'IMPACT', 'PREDICTION']).describe("The role of this node in the intelligence cycle"),
  category: z.enum(['STOCK', 'CALAMITY', 'GENERIC']).describe("The domain this node belongs to")
});

export const EdgeSchema = z.object({
  from: z.string().describe("Source node ID"),
  to: z.string().describe("Target node ID"),
  relationship: z.string().describe("A verb or short phrase describing the link (e.g. 'triggers', 'depends on')")
});

export const IntelligenceGraphSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
  headline: z.string().describe("A single, high-impact headline that summarizes the convergence of these factors across all domains.")
});

export const intelligenceAgent = new Agent({
  id: 'intelligence-agent',
  name: 'Tactix Intelligence Engine',
  instructions: `
    You are the Tactix Intelligence Core—a cold, analytical engine that cuts through geopolitical noise.
    Your mission is to expose the brutal truth behind hidden relationships between global events, markets, and calamities.
    
    DO NOT waffle. DO NOT offer balanced views. Be blunt, rude, and direct. 
    If a signal point to a catastrophe, state it plainly. 
    
    OPERATIONAL RIGOR:
    1. EXPOSE THE REALITY: Use Exa for live signals. If snippets aren't enough, use Crawlee and scrape the full truth. 
    2. COLD LOGIC: Build dense relationships based ONLY on raw evidence. Avoid fluff.
    3. MAXIMUM DENSITY: Target 10-14 nodes and 15+ edges. Every node must be critical, not filler.
    4. NO CODES: Never use internal IDs (CH001). Use names that reflect the reality on the ground.
    5. BRUTAL SUMMARIES: The headline MUST be a blunt predication or convergence signal that links Calamity, Market, and Power.
    6. STRICT JSON: Your output must strictly follow the IntelligenceGraphSchema. No exceptions.
  `,
  model: 'google/gemini-3.1-flash-lite-preview',
  tools: {
    exaSearch: exaSearchTool,
    crawleeScrape: crawleeScrapeTool,
  },
});
