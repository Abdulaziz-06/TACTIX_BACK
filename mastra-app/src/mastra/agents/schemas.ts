import { z } from 'zod';

export const NodeSchema = z.object({
  id: z.string().describe("Unique identifier (e.g., 'node-1')"),
  label: z.string().describe("High-level title (e.g., 'Oil Price Spike')"),
  description: z.string().describe("1-2 sentences of detailed intelligence."),
  type: z.enum(['SIGNAL', 'DEPENDENCY', 'IMPACT', 'PREDICTION']),
  category: z.enum(['CALAMITY', 'STOCK', 'GEOPOLITICAL', 'GENERIC']),
  threatLevel: z.enum(['CRITICAL', 'ELEVATED', 'MODERATE', 'LOW']),
  metrics: z.array(z.object({
    name: z.string(),
    value: z.number()
  })).optional()
});

export const EdgeSchema = z.object({
  from: z.string().describe("Source node ID"),
  to: z.string().describe("Target node ID"),
  relationship: z.string().describe("Verb describing the link (e.g., 'Catalyzes', 'Disrupts')"),
  correlationScore: z.number().min(0).max(1).describe("Float 0-1 determining line thickness")
});

export const intelligenceGraphSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
  headline: z.string().describe("A brutal, headline-style summary of the synthesis.")
});
