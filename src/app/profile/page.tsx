"use client";

import { useState } from "react";
import { BookOpen, Heart, Brain, User } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { IconBadge } from "@/components/ui/IconBadge";
import { ImportExport } from "@/components/profile/ImportExport";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { useAppData } from "@/context/AppDataContext";

export default function ProfilePage() {
  const { data, updateSettings } = useAppData();
  const { stats, settings } = data;
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(settings.userName);

  const saveName = () => {
    updateSettings({ userName: name.trim() || "Word Collector" });
    setEditingName(false);
  };

  return (
    <AppLayout>
      <header className="mb-8">
        <div className="flex items-center gap-4 py-1">
          <IconBadge icon={User} color="#ff64c8" size="lg" className="rounded-2xl!" />
          <div className="min-w-0 flex-1">
            {editingName ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-notion w-full text-title font-semibold"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                />
                <button onClick={saveName} className="btn-primary btn-mobile-inline shrink-0 px-4 py-2 text-sm">
                  Save
                </button>
              </div>
            ) : (
              <h1
                className="cursor-pointer break-words text-heading-2 leading-snug text-foreground"
                onClick={() => setEditingName(true)}
              >
                {settings.userName}
              </h1>
            )}
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Tap your name to edit
            </p>
          </div>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-foreground sm:text-heading-3">
          Your stats
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <StatsCard
            label="Words"
            value={stats.totalWordsSaved}
            icon={BookOpen}
            stickerColor="#62aef0"
            variant="compact"
          />
          <StatsCard
            label="Favorites"
            value={stats.favoriteWords}
            icon={Heart}
            stickerColor="#ff64c8"
            variant="compact"
          />
          <StatsCard
            label="Reviewed"
            value={stats.wordsReviewed}
            icon={Brain}
            stickerColor="#2a9d99"
            variant="compact"
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-foreground sm:text-heading-3">
          Install app
        </h2>
        <InstallPrompt />
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-foreground sm:text-heading-3">
          Data & backup
        </h2>
        <ImportExport />
      </section>
    </AppLayout>
  );
}
