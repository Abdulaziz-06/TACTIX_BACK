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
