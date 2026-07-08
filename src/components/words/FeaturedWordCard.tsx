"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Word } from "@/lib/types";
import { IconBadge } from "@/components/ui/IconBadge";
import { PronounceButton } from "@/components/words/PronounceButton";
import { cn } from "@/lib/utils";

interface FeaturedWordCardProps {
  word: Word;
  className?: string;
}

export function FeaturedWordCard({ word, className }: FeaturedWordCardProps) {
  return (
    <div className={cn("hero-band relative w-full min-w-0 overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/5" />
      </div>

      <div className="relative min-w-0">
        <div className="flex items-center gap-2">
          <IconBadge icon={Sparkles} color="#ffffff" variant="glass" size="sm" />
          <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
            Word of the day
          </span>
        </div>

        <h2 className="mt-4 break-words text-display text-on-primary sm:mt-5 lg:text-[48px] lg:tracking-[-1.5px]">
          {word.word}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {word.pronunciation && (
            <span className="break-all text-sm text-white/70">{word.pronunciation}</span>
          )}
          <PronounceButton word={word.word} variant="hero" />
          <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium capitalize text-white/90">
            {word.partOfSpeech}
          </span>
        </div>

        <p className="mt-4 line-clamp-2 break-words text-sm leading-relaxed text-white/85 sm:line-clamp-3 sm:text-[15px]">
          {word.simpleMeaning || word.meaning}
        </p>

        <Link
          href={`/word/${word.id}`}
          className="btn-secondary btn-compact btn-mobile-inline mt-5 !border-white/20 !bg-white/95 !shadow-none hover:!bg-white"
        >
          View details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
