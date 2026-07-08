"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import type { Word } from "@/lib/types";
import { TagBadge } from "@/components/ui/TagBadge";
import { LetterAvatar } from "@/components/ui/IconBadge";
import { useAppData } from "@/context/AppDataContext";
import { cn, formatRelativeDate } from "@/lib/utils";

const accentColors = ["#62aef0", "#d6b6f6", "#2a9d99", "#ff64c8", "#1aae39", "#dd5b00"];

interface WordCardProps {
  word: Word;
  showProgress?: boolean;
  className?: string;
}

export function WordCard({ word, showProgress, className }: WordCardProps) {
  const { toggleFavorite } = useAppData();
  const accent = accentColors[word.word.charCodeAt(0) % accentColors.length];

  return (
    <div
      className={cn(
        "surface-card group relative w-full min-w-0 overflow-hidden p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <LetterAvatar letter={word.word} color={accent} size="lg" className="!rounded-2xl" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/word/${word.id}`} className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="break-words text-base font-semibold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                  {word.word}
                </h3>
                <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[11px] capitalize text-muted">
                  {word.partOfSpeech}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 break-words text-sm text-muted">
                {word.simpleMeaning || word.meaning}
              </p>
              <p className="mt-2 text-xs text-faint">
                {formatRelativeDate(word.createdAt)}
              </p>
            </Link>

            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(word.id);
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-hairline bg-background transition hover:border-primary/30"
              aria-label={word.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  word.isFavorite ? "fill-primary text-primary" : "text-faint",
                )}
                strokeWidth={word.isFavorite ? 2 : 1.8}
              />
            </button>
          </div>

          {word.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {word.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}

          {showProgress && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wide text-faint">
                  Mastery
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {word.masteryLevel}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-hairline">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${word.masteryLevel}%`, backgroundColor: accent }}
                />
              </div>
            </div>
          )}

          <Link
            href={`/word/${word.id}`}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
          >
            View details <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
