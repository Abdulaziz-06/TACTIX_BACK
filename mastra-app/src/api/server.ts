import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mastra } from '../mastra/index.js';
import { intelligenceGraphSchema } from '../mastra/agents/schemas.js';

// Load environment variables
dotenv.config();

// Ensure Google API Key alias
if (process.env.GOOGLE_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_API_KEY;
}

const app = express();
const PORT = process.env.PORT || 3001;

// STRICT FRONTEND ALIGNMENT: Wide CORS for Vercel
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.includes('vercel.app') || origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());

// 1. NEXUS INTELLIGENCE WORKFLOW
app.post('/api/workflow/intelligence', async (req, res) => {
    // Spec says use 'topic'
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Valid topic string is required.' });

    try {
        const workflow = mastra.getWorkflow('intelligenceWorkflow');
        const run = await workflow.createRun();
        const runResult = await run.start({ inputData: { topic } });

        if (runResult && runResult.status === 'success') {
            const finalMap = runResult.result?.finalGraph || (runResult.steps as any)?.nexusSynthesis?.output?.finalGraph;
            // WRAPPED IN 'data' KEY AS PER SPEC
            return res.status(200).json({ data: finalMap });
        }
        return res.status(500).json({ error: runResult?.error || 'Workflow execution failed.' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

// 2. UNIFIED AGENT DISPATCHER (Market, Nature, Shadow, etc.)
app.post('/api/agent/:agentId', async (req, res) => {
    const { agentId } = req.params;
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });

    const fullAgentId = agentId.endsWith('Agent') ? agentId : `${agentId}Agent`;

    try {
        const agent = mastra.getAgent(fullAgentId as any);
        if (!agent) return res.status(404).json({ error: `Agent ${fullAgentId} not found.` });

        // Force Intelligence Graph Schema for frontend compatibility
        const result = await agent.generate(prompt, {
            structuredOutput: { schema: intelligenceGraphSchema }
        });

        // WRAPPED IN 'data' KEY AS PER SPEC
        const finalData = result.object || {
            nodes: [],
            edges: [],
            headline: result.text || "No definitive intelligence found."
        };

        return res.status(200).json({ data: finalData });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/api/list-models', async (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/health', (req, res) => res.json({ status: 'active', system: 'TACTIX' }));

app.listen(PORT, () => console.log(`🚀 TACTIX Engine Ready at PORT ${PORT}`));
