import dotenv from 'dotenv';
dotenv.config();

/**
 * Ensures that the GOOGLE_GENERATIVE_AI_API_KEY is ALWAYS set
 * if GOOGLE_API_KEY is provided, preventing SDK initialization crashes.
 */
function initEnv() {
    if (process.env.GOOGLE_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_API_KEY;
    }
}

initEnv();

const gKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY || '';
console.log(`[TACTIX] GOOGLE_API_KEY detected: ${gKey ? 'YES' : 'NO'} (Length: ${gKey.length})`);
