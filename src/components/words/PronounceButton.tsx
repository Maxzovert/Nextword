"use client";

import { Volume2 } from "lucide-react";
import { usePronunciation } from "@/hooks/usePronunciation";
import { cn } from "@/lib/utils";

interface PronounceButtonProps {
  word: string;
  variant?: "default" | "hero" | "utility";
  className?: string;
  label?: string;
}

export function PronounceButton({
  word,
  variant = "default",
  className,
  label = "Play pronunciation",
}: PronounceButtonProps) {
  const { pronounce, speaking, supported } = usePronunciation(word);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        pronounce();
      }}
      className={cn(
        "flex shrink-0 items-center justify-center transition",
        variant === "hero" &&
          "h-8 w-8 rounded-full bg-white/15 text-white hover:bg-white/25",
        variant === "utility" && "btn-utility !p-1.5",
        variant === "default" &&
          "h-9 w-9 rounded-xl border border-hairline bg-background text-foreground hover:border-primary/30",
        speaking && "ring-2 ring-primary/30",
        className,
      )}
      aria-label={label}
      title={label}
    >
      <Volume2
        className={cn(
          variant === "hero" ? "h-4 w-4" : "h-4 w-4",
          speaking && "animate-pulse text-primary",
        )}
        strokeWidth={2}
      />
    </button>
  );
}
