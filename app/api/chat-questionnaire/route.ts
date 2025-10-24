import { questionnairePrompt } from "@/components/agent/questionnaire-prompt";
import { submitQuestionnaire } from "@/components/agent/tools";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Messages array is required", { status: 400 });
    }

    const modelMessages = convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-4o"),
      system: questionnairePrompt,
      messages: modelMessages,
      tools: {
        submitQuestionnaire,
      },
      stopWhen: stepCountIs(10),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat Questionnaire API error:", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
