import { createTool } from '@mastra/core/tools';
import Exa from 'exa-js';
import { z } from 'zod';

export const exaSearchTool = createTool({
  id: 'exaSearch',
  description: `Searches the web for latest signals, stock updates, and calamity events using Exa (Semantic/AI search). The current year is ${new Date().getFullYear()}. ALWAYS search for recent and real-time data for ${new Date().getFullYear()} and beyond, avoiding outdated queries.`,
  inputSchema: z.object({
    query: z.string(),
    numResults: z.number().optional().default(5),
  }),
  execute: async ({ query, numResults }) => {
    const exa = new Exa(process.env.EXA_API_KEY || '');
    console.log(`Searching Exa for: ${query}`);
    const results = await exa.searchAndContents(query, { numResults, useAutoprompt: true });
    return results.results; // Returns array of { url, title, text, highlights }
  },
});
