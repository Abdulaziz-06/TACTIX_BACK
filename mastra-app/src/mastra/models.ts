import './env-init.js';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

/**
 * Centrally managed Google AI model provider to ensure 
 * consistent API key usage across all agents.
 */
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const defaultModel = google('gemini-1.5-flash');
