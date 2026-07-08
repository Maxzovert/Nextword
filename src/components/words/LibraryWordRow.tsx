"use client";

import Link from "next/link";
import { Heart, ChevronRight } from "lucide-react";
import type { Word } from "@/lib/types";
import { LetterAvatar } from "@/components/ui/IconBadge";
import { useAppData } from "@/context/AppDataContext";
import { cn, formatRelativeDate } from "@/lib/utils";

const accentColors = ["#62aef0", "#d6b6f6", "#2a9d99", "#ff64c8", "#1aae39", "#dd5b00"];

interface LibraryWordRowProps {
  word: Word;
  className?: string;
}

export function LibraryWordRow({ word, className }: LibraryWordRowProps) {
  const { toggleFavorite } = useAppData();
  const accent = accentColors[word.word.charCodeAt(0) % accentColors.length];

  return (
    <div className={cn("library-list-item group", className)}>
      <Link href={`/word/${word.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <LetterAvatar letter={word.word} color={accent} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold text-foreground group-hover:text-primary">
              {word.word}
            </h3>
            <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[10px] capitalize text-muted">
              {word.partOfSpeech}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-muted">
            {word.simpleMeaning || word.meaning}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-1 flex-1 max-w-[100px] overflow-hidden rounded-full bg-hairline">
              <div
                className="h-full rounded-full"
                style={{ width: `${word.masteryLevel}%`, backgroundColor: accent }}
              />
            </div>
            <span className="text-[11px] text-faint">{word.masteryLevel}%</span>
            <span className="text-[11px] text-faint">{formatRelativeDate(word.createdAt)}</span>
          </div>
        </div>
      </Link>
      <button
        onClick={() => toggleFavorite(word.id)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-hairline bg-background transition hover:border-primary/30"
        aria-label={word.isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={cn("h-4 w-4", word.isFavorite ? "fill-primary text-primary" : "text-faint")}
          strokeWidth={word.isFavorite ? 2 : 1.8}
        />
      </button>
      <Link
        href={`/word/${word.id}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-faint transition group-hover:text-primary"
        aria-label="Open word"
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
