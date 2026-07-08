import type { AppStats, Word } from "./types";

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeDate(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function parseTagsInput(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

export function parseListInput(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getMostUsedTag(words: Word[]): string {
  const counts: Record<string, number> = {};
  words.forEach((w) =>
    w.tags.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    }),
  );
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? "none";
}

export function computeStats(words: Word[], reviewCount: number): AppStats {
  const today = new Date().toISOString().split("T")[0];
  return {
    totalWordsSaved: words.length,
    wordsReviewed: reviewCount,
    favoriteWords: words.filter((w) => w.isFavorite).length,
    learningStreak: Math.min(words.length, 7),
    lastActiveDate: today,
    mostUsedTag: getMostUsedTag(words),
  };
}

export function getNextReviewDate(difficulty: "easy" | "medium" | "hard"): string {
  const days = difficulty === "easy" ? 7 : difficulty === "medium" ? 3 : 1;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
