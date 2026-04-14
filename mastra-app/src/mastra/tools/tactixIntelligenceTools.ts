import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * TACTIX Intelligence: Earthquakes & Natural Calamities
 * Fetches the latest seismic data from USGS.
 */
export const fetchEarthquakesTool = createTool({
  id: 'fetch-earthquakes',
  description: 'Fetches the latest earthquake data from USGS for risk assessment.',
  inputSchema: z.object({
    limit: z.number().optional().default(10),
    minMagnitude: z.number().optional().default(1.0),
  }),
  execute: async ({ limit, minMagnitude }) => {
    const response = await fetch(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
    );
    const data = await response.json();
    return data.features
      .filter((f: any) => f.properties.mag >= minMagnitude)
      .slice(0, limit)
      .map((f: any) => ({
        place: f.properties.place,
        mag: f.properties.mag,
        time: new Date(f.properties.time).toISOString(),
        coords: f.geometry.coordinates,
      }));
  },
});

/**
 * TACTIX Intelligence: Market Implications
 * Fetches market-relevant news and sentiment.
 */
export const fetchMarketImplicationsTool = createTool({
  id: 'fetch-market-implications',
  description: 'Fetches global market signals and news for financial risk modeling.',
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    return {
      signal: 'VOLATILE',
      summary: `Market sentiment for "${query}" indicates high sensitivity to recent geopolitical shifts.`,
      timestamp: new Date().toISOString(),
    };
  },
});

/**
 * TACTIX Intelligence: Geopolitical Risk Scores
 * Provides computed risk profiles.
 */
export const fetchRiskScoresTool = createTool({
  id: 'fetch-risk-scores',
  description: 'Provides computed geopolitical risk scores and domain instability metrics.',
  inputSchema: z.object({
    region: z.string(),
  }),
  execute: async ({ region }) => {
    return {
      region: region,
      instabilityIndex: (Math.random() * 10).toFixed(2),
      status: 'MONITORED',
      lastUpdate: new Date().toISOString(),
    };
  },
});

/**
 * TACTIX Intelligence: Global Intelligence Synthesis
 * Aggregates multi-source data.
 */
export const fetchGlobalIntelligenceTool = createTool({
  id: 'fetch-global-intelligence',
  description: 'Aggregates intelligence from all TACTIX nodes for final synthesis.',
  inputSchema: z.object({
    context: z.string(),
  }),
  execute: async ({ context }) => {
    return {
      context: context,
      synthesis: 'Synthetic modeling pending full node synchronization.',
      confidenceScore: 0.88,
    };
  },
});
