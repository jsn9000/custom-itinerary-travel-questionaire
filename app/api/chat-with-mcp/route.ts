import { questionnairePrompt } from "@/components/agent/questionnaire-prompt";
import { submitQuestionnaire } from "@/components/agent/tools";
import {
  getSupabaseMCPClient,
  getVectorizeMCPClient,
} from "@/lib/mcp";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId, userId } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Messages array is required", { status: 400 });
    }

    if (!sessionId) {
      return new Response("Session ID is required", { status: 400 });
    }

    const modelMessages = convertToModelMessages(messages);

    console.log("🚀 Initializing MCP clients...");

    // Initialize Supabase MCP client
    const supabaseClient = getSupabaseMCPClient();
    await supabaseClient.connect();

    // Initialize Vectorize MCP client
    const vectorizeClient = getVectorizeMCPClient();
    await vectorizeClient.connect();

    // Retrieve tools from MCP servers
    const supabaseTools = await supabaseClient.getTools();
    const vectorizeTools = await vectorizeClient.getTools();

    console.log(
      `🔧 Agent has access to ${Object.keys(supabaseTools).length} Supabase tools and ${Object.keys(vectorizeTools).length} Vectorize tools`
    );

    // Combine MCP tools with custom tools
    const allTools = {
      ...supabaseTools,
      ...vectorizeTools,
      submitQuestionnaire, // Keep custom questionnaire submission tool
    };

    // Wrap tools to log when they are called
    const wrappedTools = Object.fromEntries(
      Object.entries(allTools).map(([toolName, toolDef]) => {
        if (!toolDef || typeof toolDef !== 'object') {
          return [toolName, toolDef];
        }

        return [
          toolName,
          {
            ...toolDef,
            execute: toolDef.execute
              ? async (args: any, options?: any) => {
                  console.log(`\n🔧 Tool called: ${toolName}`);
                  console.log(`   Input:`, JSON.stringify(args, null, 2));
                  try {
                    const result = await toolDef.execute(args, options);
                    console.log(`   ✅ Output:`, JSON.stringify(result, null, 2));
                    return result;
                  } catch (error) {
                    console.error(`   💥 Tool error:`, error);
                    throw error;
                  }
                }
              : undefined,
          },
        ];
      })
    );

    // Enhanced system prompt with MCP context
    const enhancedPrompt = `${questionnairePrompt}

## Available MCP Tools

You have access to powerful tools from Supabase and Vectorize MCP servers:

**Supabase Tools**: Use these for database operations, querying user data, and managing conversation history.
**Vectorize Tools**: Use these for knowledge base retrieval, semantic search, and document extraction.

Use these tools to provide personalized, context-aware responses to the user.`;

    const result = streamText({
      model: openai("gpt-4o"),
      system: enhancedPrompt,
      messages: modelMessages,
      tools: wrappedTools,
      stopWhen: stepCountIs(15),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("💥 Chat with MCP API error:", error);
    return new Response(
      `Failed to generate response: ${error instanceof Error ? error.message : String(error)}`,
      { status: 500 }
    );
  }
}
