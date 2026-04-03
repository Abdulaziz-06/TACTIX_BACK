import { createTool } from '@mastra/core/tools';
import { CheerioCrawler } from 'crawlee';
import { z } from 'zod';

export const crawleeScrapeTool = createTool({
  id: 'crawleeScrape',
  description: 'Scrapes full text from a URL using Crawlee for deeper analysis.',
  inputSchema: z.object({
    url: z.string(),
  }),
  execute: async ({ url }) => {
    console.log(`Scraping with Crawlee: ${url}`);
    let textContent = '';
    const crawler = new CheerioCrawler({
      async requestHandler({ $, request }) {
        $('script, style, nav, footer').remove();
        textContent = $('body').text().replace(/\s+/g, ' ').trim();
      },
    });
    await crawler.run([url]);
    return {
      url,
      content: textContent,
      length: textContent.length
    };
  },
});
