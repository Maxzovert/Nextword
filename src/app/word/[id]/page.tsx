"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Volume2, RotateCcw, Trash2, BookOpen, Pencil } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TagBadge } from "@/components/ui/TagBadge";
import { ExampleUsage } from "@/components/words/ExampleUsage";
import { WordForm } from "@/components/words/WordForm";
import { useAppData } from "@/context/AppDataContext";
import { cn, formatDate } from "@/lib/utils";

export default function WordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, toggleFavorite, deleteWord } = useAppData();
  const word = data.words.find((w) => w.id === id);
  const [editing, setEditing] = useState(false);

  if (!word) {
    return (
      <AppLayout>
        <div className="py-20 text-center">
          <p className="text-title">Word not found</p>
          <Link href="/library" className="mt-4 text-body-sm text-primary">Back to library</Link>
        </div>
      </AppLayout>
    );
  }

  const handleDelete = () => {
    if (confirm(`Remove "${word.word}" from your nest?`)) {
      deleteWord(word.id);
      router.push("/library");
    }
  };

  if (editing) {
    return (
      <AppLayout>
        <WordForm
          mode="edit"
          initialWord={word}
          onCancel={() => setEditing(false)}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Link href="/library" className="mb-6 inline-flex items-center gap-2 text-body-sm text-muted hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        Library
      </Link>

      <article className="feature-card-elevated w-full min-w-0 overflow-hidden !p-0">
        <div className="border-b border-hairline bg-background p-4 sm:p-6 lg:p-8">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="break-words text-display text-foreground">{word.word}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {word.pronunciation && (
                  <span className="text-body-sm text-muted">{word.pronunciation}</span>
                )}
                <button className="btn-utility !p-1.5" aria-label="Play pronunciation">
                  <Volume2 className="h-4 w-4" />
                </button>
                <span className="badge-pill capitalize">{word.partOfSpeech}</span>
              </div>
            </div>
            <button
              onClick={() => toggleFavorite(word.id)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
            >
              <Heart className={cn("h-5 w-5", word.isFavorite ? "fill-primary text-primary" : "text-faint")} />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
          {word.simpleMeaning && (
            <section>
              <h2 className="text-eyebrow uppercase text-faint">Simple meaning</h2>
              <p className="mt-2 text-title text-foreground">{word.simpleMeaning}</p>
            </section>
          )}
          {word.meaning && (
            <section>
              <h2 className="text-eyebrow uppercase text-faint">Definition</h2>
              <p className="mt-2 text-body-sm leading-relaxed">{word.meaning}</p>
            </section>
          )}
          {word.example && (
            <section className="feature-card bg-background">
              <h2 className="text-eyebrow uppercase text-faint">Example usage</h2>
              <ExampleUsage
                example={word.example}
                word={word.word}
                className="mt-3 border-l-2 border-primary/30 pl-4"
              />
            </section>
          )}
          {word.source && (
            <section>
              <h2 className="text-eyebrow uppercase text-faint">Where I heard it</h2>
              <p className="mt-1 text-body-sm">{word.source}</p>
            </section>
          )}
          {word.tags.length > 0 && (
            <section>
              <h2 className="text-eyebrow uppercase text-faint">Tags</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {word.tags.map((tag) => <TagBadge key={tag} tag={tag} size="md" />)}
              </div>
            </section>
          )}
          <div className="flex items-center gap-2 text-caption text-faint">
            <BookOpen className="h-3.5 w-3.5" />
            Saved {formatDate(word.createdAt)}
            {word.masteryLevel > 0 && <span>· Mastery {word.masteryLevel}%</span>}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-hairline p-4 sm:flex-row sm:flex-wrap sm:p-6 lg:p-8">
          <button onClick={() => setEditing(true)} className="btn-primary w-full sm:w-auto">
            <Pencil className="h-4 w-4" />
            Edit word
          </button>
          <Link href="/review" className="btn-secondary w-full sm:w-auto">
            <RotateCcw className="h-4 w-4" />
            Review
          </Link>
          <button onClick={handleDelete} className="btn-utility w-full text-primary sm:w-auto">
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </article>
    </AppLayout>
  );
}
