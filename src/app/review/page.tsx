"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { ReviewFlashcard } from "@/components/words/ReviewFlashcard";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconBadge } from "@/components/ui/IconBadge";
import { useAppData } from "@/context/AppDataContext";
import { RotateCcw, Plus, PartyPopper } from "lucide-react";

export default function ReviewPage() {
  const { data, reviewWord } = useAppData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(0);

  const reviewQueue = useMemo(() => {
    return data.words
      .filter(
        (w) =>
          w.masteryLevel < 100 &&
          (!w.nextReviewAt || new Date(w.nextReviewAt) <= new Date()),
      )
      .sort((a, b) => a.masteryLevel - b.masteryLevel);
  }, [data.words]);

  const currentWord = reviewQueue[currentIndex];
  const allDone = !currentWord || currentIndex >= reviewQueue.length;
  const progress =
    reviewQueue.length > 0
      ? Math.round((completed / reviewQueue.length) * 100)
      : 0;

  const handleReview = (difficulty: "easy" | "medium" | "hard") => {
    if (!currentWord) return;
    reviewWord(currentWord.id, difficulty);
    setCompleted((c) => c + 1);
    if (currentIndex < reviewQueue.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-center gap-4 py-1 lg:hidden">
        <IconBadge icon={RotateCcw} color="#2a9d99" size="md" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-foreground">Review session</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">Flip cards and rate your recall</p>
        </div>
      </div>

      <header className="mb-6 hidden lg:block">
        <div className="flex items-center gap-3.5">
          <IconBadge icon={RotateCcw} color="#2a9d99" size="lg" className="rounded-2xl!" />
          <div>
            <h1 className="text-heading-2 text-foreground">Review</h1>
            <p className="mt-0.5 text-body-sm text-muted">Flip cards and rate your recall</p>
          </div>
        </div>
      </header>

      {reviewQueue.length === 0 ? (
        <EmptyState
          icon={RotateCcw}
          iconColor="#2a9d99"
          title="All caught up"
          description="No words due for review right now. Add more words or check back later."
          action={
            <Link href="/add" className="btn-primary">
              <Plus className="h-4 w-4" /> Add a word
            </Link>
          }
        />
      ) : allDone ? (
        <div className="surface-card mx-auto max-w-md p-8 text-center">
          <IconBadge icon={PartyPopper} color="#1aae39" size="xl" className="mx-auto rounded-2xl!" />
          <h2 className="mt-5 text-heading-3 text-foreground">Session complete</h2>
          <p className="mt-2 text-sm text-muted">
            You reviewed {completed} word{completed !== 1 ? "s" : ""} today. Nice work.
          </p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setCompleted(0);
            }}
            className="btn-primary mt-6"
          >
            Review again
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-lg">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Card {currentIndex + 1} of {reviewQueue.length}
              </span>
              <span className="text-muted">{completed} done</span>
            </div>
            <div className="review-progress-track">
              <div
                className="review-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ReviewFlashcard word={currentWord} onReview={handleReview} />
        </div>
      )}
    </AppLayout>
  );
}
