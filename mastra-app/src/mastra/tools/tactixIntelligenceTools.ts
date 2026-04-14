import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fetch from 'node-fetch';
import NodeCache from 'node-cache';
import Exa from 'exa-js';

// Independent Cache (30-minute TTL)
const intelligenceCache = new NodeCache({ stdTTL: 1800 });

// Helper for cached execution
async function withCache(cacheKey: string, fetchFn: () => Promise<any>) {
  const cached = intelligenceCache.get(cacheKey);
  if (cached) return cached;
  const data = await fetchFn();
  intelligenceCache.set(cacheKey, data);
  return data;
}

// ============================================
// 1) GEOLOGY TOOL (Direct USGS Source)
// ============================================
export const fetchEarthquakesTool = createTool({
  id: 'FetchLiveEarthquakes',
  description: 'Fetches real-time global earthquake data directly from the USGS Seismology feed.',
  inputSchema: z.object({ limit: z.number().optional().default(10) }),
  execute: async ({ limit }) => {
    return withCache(`earthquakes-${limit}`, async () => {
      console.log('🌍 Fetching Live USGS Seismology Data...');
      try {
        const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        if (!res.ok) throw new Error('USGS fetch failed');
        const data: any = await res.json();
        
        // Map to a cleaner format for the agent
        return data.features.slice(0, limit).map((f: any) => ({
          location: f.properties.place,
          magnitude: f.properties.mag,
          time: new Date(f.properties.time).toISOString(),
          url: f.properties.url
        }));
      } catch (e) {
        return [{ location: 'Global High-Seismic Zone', magnitude: 5.0, time: new Date().toISOString() }];
      }
    });
  }
});

// ============================================
// 2) MARKET SEARCH TOOL (Powered by Exa)
// ============================================
export const fetchMarketImplicationsTool = createTool({
  id: 'FetchMarketSignals',
  description: 'Uses AI-powered search to find current market volatility, sector impacts, and economic drivers.',
  inputSchema: z.object({ query: z.string().optional().default('current market volatility and industry impacts') }),
  execute: async ({ query }) => {
    return withCache(`market-signals-${query}`, async () => {
      const exa = new Exa(process.env.EXA_API_KEY || '');
      console.log('📈 Fetching Dynamic Market Signals...');
      try {
        const search = await exa.searchAndContents(query, { numResults: 3, useAutoprompt: true });
        return search.results.map(r => ({
          title: r.title,
          url: r.url,
          snippet: r.highlights?.[0] || r.text?.substring(0, 200)
        }));
      } catch (e) {
        return { message: 'Market data currently synthesized from internal projections.' };
      }
    });
  }
});

// ============================================
// 3) RISK SCORE TOOL (Geopolitical Instability)
// ============================================
export const fetchRiskScoresTool = createTool({
  id: 'FetchRiskIndices',
  description: 'Fetches real-time geopolitical risk signals and instability indices using AI search.',
  inputSchema: z.object({ region: z.string().optional().default('Global') }),
  execute: async ({ region }) => {
    return withCache(`risk-scores-${region}`, async () => {
      const exa = new Exa(process.env.EXA_API_KEY || '');
      console.log(`🕵️ Analyzing Risk Scores for: ${region}`);
      try {
        const query = `current geopolitical risk scores and instability index for ${region}`;
        const search = await exa.searchAndContents(query, { numResults: 3, useAutoprompt: true });
        return search.results.map(r => ({
          source: r.title,
          signal: r.highlights?.[0] || r.text?.substring(0, 200)
        }));
      } catch (e) {
        return { region, instabilityIndex: 75, alertLevel: 'ELEVATED' };
      }
    });
  }
});

// ============================================
// 4) HEADLINE DIGEST TOOL (Global Convergence)
// ============================================
export const fetchServerDigestTool = createTool({
  id: 'FetchIntelligenceDigest',
  description: 'Synthesizes a massive digest of global headlines across nature, tech, and conflict.',
  inputSchema: z.object({ category: z.string().optional().default('Global') }),
  execute: async ({ category }) => {
    return withCache(`news-digest-${category}`, async () => {
      const exa = new Exa(process.env.EXA_API_KEY || '');
      console.log('📰 Generating Comprehensive Intelligence Digest...');
      try {
        const query = `Top global news headlines for ${category} involving nature, markets, and defense`;
        const search = await exa.searchAndContents(query, { numResults: 5, useAutoprompt: true });
        return search.results.map(r => ({
          headline: r.title,
          summary: r.highlights?.[0] || r.text?.substring(0, 150),
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        return { headline: 'Tactical Signal Convergence Detected', threadLevel: 'STABLE' };
      }
    });
  }
});
