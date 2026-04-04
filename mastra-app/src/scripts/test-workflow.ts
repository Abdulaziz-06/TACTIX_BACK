import { mastra } from '../mastra/index.js';
import fs from 'fs/promises';

/**
 * TEST SCRIPT: Runs the Quad-Agent Intelligence Network for a given topic.
 * Testing World Monitor phase 3 deterministic capabilities.
 * 
 * Usage:
 *   npx tsx --env-file=.env src/scripts/test-workflow.ts
 */

// Mastra/AI-SDK expects GOOGLE_GENERATIVE_AI_API_KEY for Google models.
if (process.env.GOOGLE_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_API_KEY;
}

// Topic specifically tuned to invoke Nature, Security, Market, and Nexus capabilities via the new tools.
const topic = 'Global tech supply chain disruption due to earthquakes in Taiwan impacting semiconductor stocks and raising geopolitical tensions.';

async function main() {
    console.log(`\n🚀 Starting Quad-Agent Intelligence Test (World Monitor Phase 3):`);
    console.log(`Topic: "${topic}"\n`);

    try {
        const workflow = mastra.getWorkflow('intelligenceWorkflow');

        console.log('🧠 Workflow engine initialized. Coordinating parallel specialist agents...');
        console.log('⚡ Expecting Cache Hits for World Monitor tools (seismology, markets, risks)...');

        const run = await workflow.createRun();
        const runResult = await run.start({ inputData: { topic } });

        console.log('\n--- ✅ Workflow Execution Completed ---\n');

        if (runResult) {
            console.log(`Execution Status: ${runResult.status}`);

            if ('steps' in runResult) {
                Object.entries(runResult.steps).forEach(([stepId, result]: [string, any]) => {
                    console.log(`- Step [${stepId}]: Status ${result.status}`);
                });
            }

            if (runResult.status === 'success') {
                const finalMap = runResult.result?.finalGraph || (runResult.steps as any)?.nexusSynthesis?.output?.finalGraph;

                if (finalMap) {
                    console.log('\n--- 📊 Generated Nexus Intelligence Map ---\n');
                    const formattedMap = typeof finalMap === 'string' ? JSON.parse(finalMap) : finalMap;

                    console.log(JSON.stringify(formattedMap, null, 2));

                    // Save to JSON file
                    const outputPath = 'intelligence-output-world-monitor.json';
                    await fs.writeFile(outputPath, JSON.stringify(formattedMap, null, 2));
                    console.log(`\n💾 Unified Intelligence Graph saved to ${outputPath}`);
                } else {
                    console.error('⚠️ Nexus step returned success, but finalGraph was empty or not found in the expected format.');
                    console.log(JSON.stringify(runResult.result, null, 2));
                }
            } else if (runResult.status === 'failed') {
                console.error(`Workflow failed with error:`, (runResult as any).error);
            }
        } else {
            console.log('No result object returned from execute.');
        }

    } catch (e: any) {
        console.error('\n❌  Workflow execution encountered a fatal error:');
        console.error(e.message || e);
        if (e.stack) {
            // console.log('\nStack Trace:');
            // console.log(e.stack);
        }
        process.exit(1);
    }
}

main();
