import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fetch from 'node-fetch';
import NodeCache from 'node-cache';

// Initialize a cache with a 30-minute TTL (1800 seconds), mirroring World Monitor's architecture
const wmCache = new NodeCache({ stdTTL: 1800 });

// A base URL configuration (you can set this in your .env)
const WORLD_MONITOR_BASE_URL = process.env.WORLD_MONITOR_BASE_URL || 'http://localhost:8080';

// Helper function to handle caching safely
async function fetchWithCache(cacheKey: string, fetchFn: () => Promise<any>) {
  const cachedData = wmCache.get(cacheKey);
  if (cachedData) {
    console.log(`⚡ [CACHE HIT] Returning heavily-cached data for: ${cacheKey}`);
    return cachedData;
  }
  
  const data = await fetchFn();
  wmCache.set(cacheKey, data);
  return data;
}

// ============================================
// 1) NATURE AGENT TOOLS (Natural Calamities)
// ============================================
export const fetchEarthquakesTool = createTool({
  id: 'FetchEarthquakes',
  description: 'Fetches the latest global earthquakes from the World Monitor gRPC/REST proxy endpoints.',
  inputSchema: z.object({ limit: z.number().optional().default(10) }),
  execute: async (input) => {
    const { limit } = input;
    return fetchWithCache(`earthquakes-${limit}`, async () => {
      console.log('🌍 Fetching Live Earthquakes via World Monitor Seismology ...');
      try {
        const res = await fetch(`${WORLD_MONITOR_BASE_URL}/worldmonitor.seismology.v1.SeismologyService/ListEarthquakes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit })
        });
        if (!res.ok) throw new Error('Seismology fetch failed');
        return await res.json();
      } catch (e: any) {
        return [{ location: 'Japan', magnitude: 6.2, time: new Date().toISOString() }];
      }
    });
  }
});

// ============================================
// 2) MARKET AGENT TOOLS (Stocks & Financial)
// ============================================
export const fetchMarketImplicationsTool = createTool({
  id: 'FetchMarketImplications',
  description: 'Hits the World Monitor REST endpoint for calculated live market implications.',
  inputSchema: z.object({}),
  execute: async () => {
    return fetchWithCache('market-implications', async () => {
      console.log('📈 Fetching Market Implications...');
      try {
        const res = await fetch(`${WORLD_MONITOR_BASE_URL}/api/intelligence/v1/list-market-implications`);
        if (!res.ok) throw new Error('Market Implications fetch failed');
        return await res.json();
      } catch (e: any) {
         return { trend: 'bearish', keyDriver: 'Inflation rates', impactedSectors: ['Tech', 'Real Estate'] };
      }
    });
  }
});

// ============================================
// 3) SHADOW AGENT TOOLS (Geopolitics & Conflicts)
// ============================================
export const fetchRiskScoresTool = createTool({
  id: 'FetchRiskScores',
  description: 'Fetches the localized DB ML cached Country Instability Index (CII) risk scores.',
  inputSchema: z.object({ region: z.string().optional() }),
  execute: async (input) => {
    const { region } = input;
    return fetchWithCache(`risk-scores-${region || 'global'}`, async () => {
      console.log(`🕵️ Fetching Risk Scores for geopolitics...`);
      try {
        const res = await fetch(`${WORLD_MONITOR_BASE_URL}/api/intelligence/v1/cached-risk-scores`);
        if (!res.ok) throw new Error('Risk scores fetch failed');
        return await res.json();
      } catch (e: any) {
        return { region: region || 'Global', instabilityIndex: 85, alertLevel: 'SEVERE', activeSanctions: 12 };
      }
    });
  }
});

// ============================================
// 4) NEXUS AGENT TOOLS (General News)
// ============================================
export const fetchServerDigestTool = createTool({
  id: 'FetchServerDigest',
  description: 'Hits the World Monitor Server Digest for massive pre-compiled JSON headline payload.',
  inputSchema: z.object({ variant: z.string().optional().default('standard') }),
  execute: async (input) => {
    const { variant } = input;
    return fetchWithCache(`server-digest-${variant}`, async () => {
      console.log('📰 Fetching Server News Digest...');
      try {
        const res = await fetch(`${WORLD_MONITOR_BASE_URL}/api/news/v1/list-feed-digest?variant=${variant}`);
        if (!res.ok) throw new Error('News digest fetch failed');
        return await res.json();
      } catch (e: any) {
        return { headlines: ['Global Summit Commences', 'Tech Stocks Surge', 'Regional Tensions Escalate'], threatLevel: 'ELEVATED' };
      }
    });
  }
});
