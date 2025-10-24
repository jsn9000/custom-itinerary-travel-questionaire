"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ChatAssistant from "@/components/chat/chat-assistant";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const TOTAL_QUESTIONS = 20;

  const typewriterSentences = [
    "Hi there! I'm your AI Travel Concierge — here to plan your perfect trip.",
    "I'll collect your preferences and show you personalized options, then one of our friendly human concierges will reach out to finalize everything.",
    "Think of it as teamwork: I do the thinking, they do the booking."
  ];

  const initialMessages = [
    {
      role: "assistant" as const,
      content: "Let's start by getting to know you a bit — what's your name?"
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-neutral-50">
      {/* Header with Logo - 25% larger */}
      <div className="bg-neutral-50 border-b border-neutral-200 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center">
            <img
              src="/mame-dee-header.png"
              alt="Mame Dee Travel World - Travel Concierge"
              className="h-40 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Main Content - Title */}
      <div className="flex-shrink-0 text-center pt-8 pb-4 px-6">
        <h1 className="text-4xl font-bold text-neutral-900">
          Start Planning Your Dream Trip
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">
              Progress
            </span>
            <span className="text-sm text-neutral-600">
              {Math.min(progress, TOTAL_QUESTIONS)} of {TOTAL_QUESTIONS} questions
            </span>
          </div>
          <Progress value={(progress / TOTAL_QUESTIONS) * 100} className="h-2" />
        </div>
      </div>

      {/* Chat Interface - Front and Center with Shadow */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="max-w-2xl mx-auto h-full bg-white rounded-lg shadow-lg border border-neutral-200">
          <ChatAssistant
            api="/api/chat-questionnaire"
            initialMessages={initialMessages}
            placeholder="Type your answer here..."
            useTypewriter={true}
            typewriterSentences={typewriterSentences}
            onProgressUpdate={setProgress}
          />
        </div>
      </div>

      {/* Traditional Form Button - Bottom */}
      <div className="flex-shrink-0 pb-8 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-neutral-600 mb-3">
            Prefer a traditional form?
          </p>
          <Button
            onClick={() => router.push('/questionnaire')}
            variant="outline"
            size="lg"
          >
            📝 Fill Out Form Instead
          </Button>
        </div>
      </div>
    </div>
  );
}
