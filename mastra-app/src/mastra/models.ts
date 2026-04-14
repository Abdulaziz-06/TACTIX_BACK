import './env-init.js';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

/**
 * Centrally managed Google AI model.
 * Using a direct provider connection for maximum reliability on Render.
 */
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY,
});

export const defaultModel = google('gemini-2.0-flash');
