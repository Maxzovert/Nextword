"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Word } from "@/lib/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LetterAvatar } from "@/components/ui/IconBadge";
import { Brain, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface WordCarouselProps {
  words: Word[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  action?: { href: string; label: string };
  variant?: "remember" | "recent";
  className?: string;
}

const stickerAccents = [
  "#62aef0",
  "#d6b6f6",
  "#2a9d99",
  "#ff64c8",
  "#1aae39",
  "#dd5b00",
];

export function WordCarousel({
  words,
  title = "Words to remember",
  subtitle = "Swipe through your vocabulary",
  emptyMessage = "No words yet. Add your first word.",
  action,
  variant = "remember",
  className,
}: WordCarouselProps) {
  const sectionIcon = variant === "recent" ? Clock : Brain;
  const sectionColor = variant === "recent" ? "#ff64c8" : "#2a9d99";

  if (words.length === 0) {
    return (
      <section className={cn("mb-6", className)}>
        <SectionHeader
          title={title}
          subtitle={subtitle}
          icon={sectionIcon}
          iconColor={sectionColor}
        />
        <div className="empty-state-card py-8 text-center">
          <p className="text-sm text-muted">{emptyMessage}</p>
          <Link href="/add" className="btn-compact btn-primary mt-4">
            Add word
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("mb-6", className)}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={sectionIcon}
        iconColor={sectionColor}
        action={action ?? { href: "/library", label: "See all" }}
      />
      <div className="scroll-row carousel-track flex gap-3 pb-1">
        {words.map((word, i) => {
          const accent = stickerAccents[i % stickerAccents.length];
          return (
            <Link
              key={word.id}
              href={`/word/${word.id}`}
              className="carousel-card group shrink-0 snap-start"
            >
              <div className="carousel-card-body">
                <div className="flex items-start gap-2.5">
                  <LetterAvatar letter={word.word} color={accent} size="md" />
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-[15px] font-semibold text-foreground transition-colors group-hover:text-primary">
                      {word.word}
                    </h3>
                    <span className="mt-0.5 inline-block rounded-full bg-background px-2 py-0.5 text-[10px] capitalize text-muted">
                      {word.partOfSpeech}
                    </span>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
                  {word.simpleMeaning || word.meaning}
                </p>
                <div className="mt-3.5">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-faint">
                      Mastery
                    </span>
                    <span className="text-[11px] font-semibold text-foreground">
                      {word.masteryLevel}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-hairline">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${word.masteryLevel}%`,
                        backgroundColor: accent,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
