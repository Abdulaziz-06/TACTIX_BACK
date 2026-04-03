import { z } from 'zod';

export const NodeSchema = z.object({
  id: z.string().describe("Unique descriptive ID (e.g. 'oil_spike')"),
  label: z.string().describe("Short title (e.g. 'Brent Crude Rally')"),
  description: z.string().describe("Direct, blunt description of the node and its fallout"),
  type: z.enum(['SIGNAL', 'DEPENDENCY', 'IMPACT', 'PREDICTION']).describe("Role in the intelligence chain"),
  category: z.enum(['STOCK', 'CALAMITY', 'GENERIC']).describe("The domain this node primarily impacts")
});

export const EdgeSchema = z.object({
  from: z.string().describe("Source node ID"),
  to: z.string().describe("Target node ID"),
  relationship: z.string().describe("Blunt phrase describing the causal link (e.g. 'triggers', 'starves', 'bleeds')")
});

export const intelligenceGraphSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
  headline: z.string().describe("A brutal, headline-style summary of the convergence.")
});
