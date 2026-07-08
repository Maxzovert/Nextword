"use client";

import Link from "next/link";
import {
  Plus,
  BookOpen,
  Star,
  Brain,
  TrendingUp,
  ArrowRight,
  Sparkles,
  RotateCcw,
  FolderOpen,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FeaturedWordCard } from "@/components/words/FeaturedWordCard";
import { WordCarousel } from "@/components/words/WordCarousel";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { StatsCard } from "@/components/ui/StatsCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { QuickActions } from "@/components/ui/QuickActions";
import { IconBadge } from "@/components/ui/IconBadge";
import { useAppData } from "@/context/AppDataContext";
import { getGreeting } from "@/lib/utils";

export default function HomePage() {
  const { data } = useAppData();
  const { words, collections, stats, settings } = data;

  const recentWords = [...words]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
  const featuredWord = recentWords[0] ?? null;
  const rememberWords = words
    .filter((w) => w.masteryLevel < 100)
    .sort((a, b) => a.masteryLevel - b.masteryLevel)
    .slice(0, 8);
  const dueForReview = words.filter(
    (w) => !w.nextReviewAt || new Date(w.nextReviewAt) <= new Date(),
  ).length;

  const showRecentCarousel =
    recentWords.length > 0 &&
    (rememberWords.length === 0 ||
      recentWords.some((w) => !rememberWords.find((r) => r.id === w.id)));

  const firstName = settings.userName.split(" ")[0];

  return (
    <AppLayout>
      <header className="mb-6 flex items-center gap-4 py-1 lg:hidden">
        <IconBadge icon={Sparkles} color="#0075de" size="lg" className="rounded-2xl!" />
        <div className="min-w-0">
          <p className="text-base font-semibold leading-snug text-foreground">
            {getGreeting()}, {firstName}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Build your personal vocabulary
          </p>
        </div>
      </header>

      <header className="mb-8 hidden items-center justify-between lg:flex">
        <div className="flex min-w-0 items-center gap-4">
          <IconBadge icon={Sparkles} color="#0075de" size="xl" className="!rounded-2xl" />
          <div className="min-w-0">
            <h1 className="break-words text-display text-foreground">
              {getGreeting()}, {firstName}
            </h1>
            <p className="mt-1 text-body-sm text-muted">
              Build your personal vocabulary
            </p>
          </div>
        </div>
        <Link href="/add" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add word
        </Link>
      </header>

      <QuickActions className="mb-6 lg:hidden" />

      {featuredWord ? (
        <FeaturedWordCard word={featuredWord} className="mb-6" />
      ) : (
        <div className="empty-state-card mb-6 text-center">
          <div className="mx-auto mb-4">
            <IconBadge icon={Sparkles} color="#0075de" size="xl" className="!rounded-2xl" />
          </div>
          <p className="text-base font-semibold">Your nest is empty</p>
          <p className="mt-1 text-sm text-muted">
            Save words you discover and review them later
          </p>
          <Link href="/add" className="btn-compact btn-primary mt-4">
            <Plus className="h-4 w-4" /> Add your first word
          </Link>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard label="Saved" value={stats.totalWordsSaved} icon={BookOpen} stickerColor="#62aef0" />
        <StatsCard label="Streak" value={stats.learningStreak} icon={Star} stickerColor="#d6b6f6" />
        <StatsCard label="Reviewed" value={stats.wordsReviewed} icon={Brain} stickerColor="#2a9d99" />
        <StatsCard
          label="Retention"
          value={`${Math.min(95, Math.round((stats.wordsReviewed / Math.max(stats.totalWordsSaved, 1)) * 100 + 40))}%`}
          icon={TrendingUp}
          stickerColor="#1aae39"
        />
      </div>

      {dueForReview > 0 && (
        <Link href="/review" className="review-banner mb-6">
          <div className="flex items-center gap-3">
            <IconBadge icon={RotateCcw} color="#0075de" size="md" />
            <div>
              <p className="text-sm font-semibold text-foreground">Ready for review</p>
              <p className="mt-0.5 text-xs text-muted">
                {dueForReview} word{dueForReview !== 1 ? "s" : ""} waiting
              </p>
            </div>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </div>
        </Link>
      )}

      <WordCarousel
        words={rememberWords.length > 0 ? rememberWords : recentWords}
        title="Words to remember"
        subtitle="Focus on words you are still learning"
        action={{ href: "/review", label: "Review" }}
        variant="remember"
        emptyMessage="No words yet. Add your first word."
      />

      {showRecentCarousel && (
        <WordCarousel
          words={recentWords}
          title="Recently added"
          subtitle="Your latest catches"
          action={{ href: "/library", label: "Library" }}
          variant="recent"
          emptyMessage="Nothing here yet."
        />
      )}

      <section className="mb-6">
        <SectionHeader
          title="Collections"
          subtitle="Organize words by theme"
          icon={FolderOpen}
          iconColor="#d6b6f6"
          action={{ href: "/collections", label: "View all" }}
        />
        <div className="scroll-row carousel-track flex gap-3 pb-1">
          {collections.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
