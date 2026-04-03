import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mastra } from '../mastra/index.js';
import { intelligenceGraphSchema } from '../mastra/agents/schemas.js';

// Load environment variables manually if needed
dotenv.config();

// Ensure Google API Key alias is set
if (process.env.GOOGLE_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_API_KEY;
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Main Workflow Trigger API
app.post('/api/workflow/intelligence', async (req, res) => {
    const { topic } = req.body;

    if (!topic || typeof topic !== 'string') {
        return res.status(400).json({ error: 'Valid topic string is required in the request body.' });
    }

    try {
        console.log(`\n🚀 Received API Request for Quad-Agent Test: "${topic}"\n`);
        const workflow = mastra.getWorkflow('intelligenceWorkflow');
        const run = await workflow.createRun();
        
        console.log('🧠 Executing workflow run...');
        const runResult = await run.start({ inputData: { topic } });
        
        if (runResult && runResult.status === 'success') {
            const finalMap = runResult.result?.finalGraph || (runResult.steps as any)?.nexusSynthesis?.output?.finalGraph;
            const formattedMap = typeof finalMap === 'string' ? JSON.parse(finalMap) : finalMap;
            
            console.log('✅ Workflow Execution Completed via API');
            return res.status(200).json({
                status: 'success',
                message: 'Intelligence graph successfully generated.',
                data: formattedMap
            });
        } else if (runResult?.status === 'failed') {
            console.error('❌ Workflow Execution Failed via API');
            return res.status(500).json({
                status: 'failed',
                error: runResult?.error || 'Unknown workflow error occurred.'
            });
        } else {
            return res.status(500).json({
                status: 'error',
                error: 'Workflow returned unexpected status or result object.'
            });
        }
    } catch (error: any) {
        console.error('❌ API Error:', error);
        return res.status(500).json({
            status: 'error',
            error: error.message || 'Internal server error during workflow execution.'
        });
    }
});

// Individual Agent Trigger API
app.post('/api/agent/:agentId', async (req, res) => {
    const { agentId } = req.params;
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Valid prompt string is required in the request body.' });
    }

    // Support both 'market' and 'marketAgent'
    const fullAgentId = agentId.endsWith('Agent') ? agentId : `${agentId}Agent`;

    try {
        console.log(`\n🤖 Received API Request for Agent [${fullAgentId}]`);
        // The type requires one of the keys provided in the mastra instance
        const agent = mastra.getAgent(fullAgentId as any);
        
        if (!agent) {
             return res.status(404).json({ error: `Agent ${fullAgentId} not found.` });
        }
        
        console.log(`Executing agent prompt...`);
        const result = await agent.generate(prompt, {
            structuredOutput: { schema: intelligenceGraphSchema }
        });
        
        console.log(`✅ Agent [${fullAgentId}] Execution Completed`);
        return res.status(200).json({
            status: 'success',
            agent: fullAgentId,
            data: result.object || result.text
        });
    } catch (error: any) {
        console.error(`❌ Agent [${fullAgentId}] API Error:`, error);
        return res.status(500).json({
            status: 'error',
            error: error.message || 'Internal server error during agent execution.'
        });
    }
});

// A basic health check index
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mastra: 'ready' });
});

app.listen(PORT, () => {
    console.log(`🚀 Mastra Express APIs running at http://localhost:${PORT}/api`);
});
