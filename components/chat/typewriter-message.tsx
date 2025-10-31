"use client";

import { useState, useEffect } from "react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";

interface TypewriterMessageProps {
  sentences: string[];
  finalMessage: string;
  onComplete?: () => void;
}

export function TypewriterMessage({ sentences, finalMessage, onComplete }: TypewriterMessageProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [completedText, setCompletedText] = useState(""); // All completed sentences
  const [currentTypingText, setCurrentTypingText] = useState(""); // Currently typing sentence
  const [isTyping, setIsTyping] = useState(true);
  const [isPausing, setIsPausing] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    // If we've gone through all sentences, show the final message
    if (currentSentenceIndex >= sentences.length) {
      // Wait 3 seconds before showing the final message
      setTimeout(() => {
        setShowFinal(true);
        // Add final message with proper spacing
        const finalText = completedText + (completedText ? "\n\n" : "") + finalMessage;
        setCompletedText(finalText);
        setCurrentTypingText("");
        if (onComplete) {
          onComplete();
        }
      }, 3000);
      return;
    }

    const currentSentence = sentences[currentSentenceIndex];
    let charIndex = 0;

    // Typing effect
    if (isTyping && !isPausing) {
      const typingInterval = setInterval(() => {
        if (charIndex <= currentSentence.length) {
          setCurrentTypingText(currentSentence.slice(0, charIndex));
          charIndex++;
        } else {
          // Finished typing current sentence
          clearInterval(typingInterval);
          setIsTyping(false);
          setIsPausing(true);

          // Wait 0.6 seconds before moving to next sentence
          setTimeout(() => {
            // Move current sentence to completed text
            setCompletedText(prev => prev + (prev ? "\n\n" : "") + currentSentence);
            setCurrentTypingText("");
            setCurrentSentenceIndex(prev => prev + 1);
            setIsTyping(true);
            setIsPausing(false);
          }, 600);
        }
      }, 20); // Speed of typing (20ms per character)

      return () => clearInterval(typingInterval);
    }
  }, [currentSentenceIndex, isTyping, isPausing, sentences, finalMessage, onComplete, completedText]);

  const fullText = completedText + (completedText && currentTypingText ? "\n\n" : "") + currentTypingText;

  return (
    <Message from="assistant">
      <MessageContent>
        <div className="text-[15px] leading-relaxed text-foreground whitespace-pre-wrap break-words">
          {fullText}
          {!showFinal && isTyping && !isPausing && <span className="animate-pulse ml-0.5">|</span>}
        </div>
      </MessageContent>
    </Message>
  );
}
