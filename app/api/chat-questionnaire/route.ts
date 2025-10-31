import { questionnairePrompt } from "@/components/agent/questionnaire-prompt";
import {
  submitQuestionnaire,
  saveMemory,
  saveConversationMessage,
  retrieveKnowledgeBase
} from "@/components/agent/tools";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { NextRequest } from "next/server";
import { MemoryService } from "@/lib/memory/memory-service";

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId, userId } = await request.json();

    console.log(`[Questionnaire API] Request received - SessionId: ${sessionId}, Messages count: ${messages?.length}`);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("[Questionnaire API] Invalid messages array");
      return new Response("Messages array is required", { status: 400 });
    }

    if (!sessionId) {
      console.error("[Questionnaire API] Missing session ID");
      return new Response("Session ID is required", { status: 400 });
    }

    const modelMessages = convertToModelMessages(messages);
    console.log(`[Questionnaire API] Converted ${modelMessages.length} messages for model`);

    // Build context from memory and previous conversations
    // This ONLY loads data for the current sessionId - enforces session isolation
    const memoryService = new MemoryService();
    const memoryContext = await memoryService.buildContextForSession(sessionId, userId);

    // Enhance system prompt with memory context
    let enhancedPrompt = questionnairePrompt;
    if (memoryContext) {
      enhancedPrompt += `\n\n${memoryContext}\n\nUse this context to provide personalized responses and remember information from previous interactions.`;
    }

    console.log(`[Questionnaire API] Starting streamText with model: gpt-4o, temperature: 0.5`);

    const result = streamText({
      model: openai("gpt-4o"),
      system: enhancedPrompt,
      messages: modelMessages,
      tools: {
        submitQuestionnaire,
        saveMemory,
        saveConversationMessage,
        retrieveKnowledgeBase,
        // NOTE: retrieveMemory tool removed for security
        // Users can only access their own session data (auto-loaded above)
        // Backend admins can access all data via Supabase dashboard/MCP
      },
      stopWhen: stepCountIs(15),
      temperature: 0.5, // Balanced: fast but still responsive
    });

    console.log(`[Questionnaire API] StreamText initialized, returning response`);
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[Questionnaire API] Error:", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
