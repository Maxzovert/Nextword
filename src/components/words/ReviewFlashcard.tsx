"use client";

import { useState } from "react";
import { RotateCcw, ThumbsUp, Meh, ThumbsDown } from "lucide-react";
import type { Word } from "@/lib/types";
import { LetterAvatar } from "@/components/ui/IconBadge";
import { ExampleUsage } from "@/components/words/ExampleUsage";
import { PronounceButton } from "@/components/words/PronounceButton";
import { cn } from "@/lib/utils";

const accentColors = ["#62aef0", "#d6b6f6", "#2a9d99", "#ff64c8", "#1aae39", "#dd5b00"];

interface ReviewFlashcardProps {
  word: Word;
  onReview: (difficulty: "easy" | "medium" | "hard") => void;
}

export function ReviewFlashcard({ word, onReview }: ReviewFlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const accent = accentColors[word.word.charCodeAt(0) % accentColors.length];

  const handleReview = (difficulty: "easy" | "medium" | "hard") => {
    setFlipped(false);
    onReview(difficulty);
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="flip-scene h-[320px] sm:h-[360px]">
        <div
          className={cn("flip-inner h-full w-full", flipped && "is-flipped")}
          onClick={() => setFlipped(!flipped)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped(!flipped);
            }
          }}
        >
          <div
            className="flip-face flashcard-shell flex flex-col items-center justify-center p-6 sm:p-8"
            style={{ "--accent": accent } as React.CSSProperties}
          >
            <LetterAvatar letter={word.word} color={accent} size="xl" className="rounded-2xl!" />
            <h2 className="mt-4 text-center text-display">{word.word}</h2>
            <div className="mt-3 flex items-center justify-center gap-2">
              {word.pronunciation && (
                <p className="text-sm text-muted">{word.pronunciation}</p>
              )}
              <PronounceButton word={word.word} />
            </div>
            <span className="badge-pill mt-3 capitalize">{word.partOfSpeech}</span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-faint">
              Tap to flip
            </p>
          </div>

          <div
            className="flip-face flip-face-back flashcard-shell flex flex-col justify-center overflow-y-auto p-6 sm:p-8"
            style={{ "--accent": accent } as React.CSSProperties}
          >
            {word.simpleMeaning && (
              <p className="text-base font-semibold text-primary">{word.simpleMeaning}</p>
            )}
            {word.meaning && (
              <p className="mt-2 text-sm leading-relaxed text-foreground">{word.meaning}</p>
            )}
            {word.example && (
              <div className="mt-4">
                <ExampleUsage
                  example={word.example}
                  word={word.word}
                  className="rounded-xl border border-hairline bg-background px-4 py-3"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setFlipped(!flipped)}
          className="btn-utility gap-2 px-5"
          aria-label="Flip card"
        >
          <RotateCcw className="h-4 w-4" />
          {flipped ? "Show word" : "Flip card"}
        </button>
      </div>

      {flipped && (
        <div className="mt-6 space-y-3">
          <p className="text-center text-sm font-medium text-muted">How well did you remember it?</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleReview("easy")}
              className="review-rating-btn review-rating-easy"
            >
              <ThumbsUp className="h-5 w-5" strokeWidth={2.2} />
              Easy
            </button>
            <button
              onClick={() => handleReview("medium")}
              className="review-rating-btn review-rating-medium"
            >
              <Meh className="h-5 w-5" strokeWidth={2.2} />
              Medium
            </button>
            <button
              onClick={() => handleReview("hard")}
              className="review-rating-btn review-rating-hard"
            >
              <ThumbsDown className="h-5 w-5" strokeWidth={2.2} />
              Hard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
