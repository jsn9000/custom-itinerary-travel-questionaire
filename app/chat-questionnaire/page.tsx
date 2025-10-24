"use client";

import ChatAssistant from "@/components/chat/chat-assistant";

export default function ChatQuestionnairePage() {
  const typewriterSentences = [
    "Hi there! I'm your AI Travel Concierge — here to plan your perfect trip.",
    "I'll collect your preferences and show you personalized options, then one of our friendly human concierges will reach out to finalize everything.",
    "Think of it as teamwork: I do the thinking, they do the booking."
  ];

  const initialMessages = [
    {
      role: "assistant" as const,
      content: "Let's start by getting to know you a bit — what's your name, and how many people will be traveling?"
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-neutral-50">
      {/* Header with Logo */}
      <div className="bg-neutral-50 border-b border-neutral-200 flex-shrink-0">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <img
              src="/mame-dee-header.png"
              alt="Mame Dee Travel World - Travel Concierge"
              className="h-24 w-auto"
            />
            <a
              href="/"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* Chat Interface - Centered */}
      <div className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="w-full max-w-2xl h-full">
          <ChatAssistant
            api="/api/chat-questionnaire"
            initialMessages={initialMessages}
            placeholder="Type your answer here..."
            useTypewriter={true}
            typewriterSentences={typewriterSentences}
          />
        </div>
      </div>
    </div>
  );
}
