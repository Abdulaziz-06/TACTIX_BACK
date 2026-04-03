import { Workflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { marketAgent } from '../agents/market';
import { natureAgent } from '../agents/nature';
import { shadowAgent } from '../agents/shadow';
import { nexusAgent } from '../agents/nexus';
import { intelligenceGraphSchema } from '../agents/schemas';

const topicSchema = z.object({
  topic: z.string().describe('The core topic to analyze (e.g., semiconductor supply chain, Middle East conflict)'),
});

const analysisSchema = z.object({
  analysis: z.any()
});

const marketAnalysisStep = createStep({
  id: 'marketAnalysis',
  inputSchema: topicSchema,
  outputSchema: analysisSchema,
  execute: async ({ inputData }) => {
    const res = await marketAgent.generate(`Analyze the financial market impact and Indian stock specifics for: ${inputData.topic}`, {
      structuredOutput: { schema: intelligenceGraphSchema }
    });
    return { analysis: res.object || res.text };
  }
});

const natureAnalysisStep = createStep({
  id: 'natureAnalysis',
  inputSchema: topicSchema,
  outputSchema: analysisSchema,
  execute: async ({ inputData }) => {
    const res = await natureAgent.generate(`Analyze the environmental and resource scarcity impact for: ${inputData.topic}`, {
      structuredOutput: { schema: intelligenceGraphSchema }
    });
    return { analysis: res.object || res.text };
  }
});

const shadowAnalysisStep = createStep({
  id: 'shadowAnalysis',
  inputSchema: topicSchema,
  outputSchema: analysisSchema,
  execute: async ({ inputData }) => {
    const res = await shadowAgent.generate(`Analyze the gray-zone logistics and infrastructure fragility for: ${inputData.topic}`, {
      structuredOutput: { schema: intelligenceGraphSchema }
    });
    return { analysis: res.object || res.text };
  }
});

const nexusSynthesisStep = createStep({
  id: 'nexusSynthesis',
  inputSchema: z.object({
    marketAnalysis: analysisSchema.optional(),
    natureAnalysis: analysisSchema.optional(),
    shadowAnalysis: analysisSchema.optional(),
  }).catchall(z.any()),
  outputSchema: z.object({ finalGraph: z.any() }),
  execute: async ({ inputData, getInitData }) => {
    const initData = getInitData() as Record<string, any>;
    const topic = initData?.topic || 'Unknown topic';
    
    const market = inputData.marketAnalysis?.analysis;
    const nature = inputData.natureAnalysis?.analysis;
    const shadow = inputData.shadowAnalysis?.analysis;

    const prompt = `
      TOPIC: ${topic}
      
      MARKET DATA: ${JSON.stringify(market)}
      NATURE DATA: ${JSON.stringify(nature)}
      SHADOW DATA: ${JSON.stringify(shadow)}
      
      Task: Map the convergent domino sequence across these three domains into a unified, blunt strategic intelligence graph.
      Focus on convergences where environmental collapse leads to market failure and vice versa.
    `;

    const res = await nexusAgent.generate(prompt, {
      structuredOutput: { schema: intelligenceGraphSchema }
    });
    
    return { finalGraph: res.object || res.text };
  }
});

export const intelligenceWorkflow = new Workflow({
  id: 'intelligenceWorkflow',
  inputSchema: topicSchema,
  outputSchema: z.object({ finalGraph: z.any() })
})
  .parallel([marketAnalysisStep, natureAnalysisStep, shadowAnalysisStep])
  .then(nexusSynthesisStep)
  .commit();
