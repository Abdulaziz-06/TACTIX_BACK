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

console.log(`[TACTIX] Initializing Environment...`);
console.log(`[TACTIX] GOOGLE_API_KEY detected: ${process.env.GOOGLE_API_KEY ? 'YES' : 'NO'}`);
console.log(`[TACTIX] EXA_API_KEY detected: ${process.env.EXA_API_KEY ? 'YES' : 'NO'}`);
