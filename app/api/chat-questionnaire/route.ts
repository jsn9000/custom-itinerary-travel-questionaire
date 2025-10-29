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

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Messages array is required", { status: 400 });
    }

    if (!sessionId) {
      return new Response("Session ID is required", { status: 400 });
    }

    const modelMessages = convertToModelMessages(messages);

    // Build context from memory and previous conversations
    // This ONLY loads data for the current sessionId - enforces session isolation
    const memoryService = new MemoryService();
    const memoryContext = await memoryService.buildContextForSession(sessionId, userId);

    // Enhance system prompt with memory context
    let enhancedPrompt = questionnairePrompt;
    if (memoryContext) {
      enhancedPrompt += `\n\n${memoryContext}\n\nUse this context to provide personalized responses and remember information from previous interactions.`;
    }

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
      temperature: 0.7, // More focused responses
      maxTokens: 150, // Limit response length to prevent multiple questions
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat Questionnaire API error:", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
