"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { WordCard } from "@/components/words/WordCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppData } from "@/context/AppDataContext";
import { BookOpen } from "lucide-react";

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data } = useAppData();

  const collection = data.collections.find((c) => c.slug === slug);

  const words = useMemo(() => {
    if (!collection) return [];
    return data.words.filter((w) => collection.wordIds.includes(w.id));
  }, [collection, data.words]);

  if (!collection) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-lg font-semibold">Collection not found</p>
          <Link href="/collections" className="mt-4 text-primary text-sm">
            ← Back to collections
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Link
        href="/collections"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Collections
      </Link>

      <header className="mb-8 rounded-lg border border-hairline overflow-hidden">
        <div className="h-12 px-6 flex items-center" style={{ backgroundColor: collection.color }}>
          <h1 className="text-heading-3 text-foreground">{collection.name}</h1>
        </div>
        <div className="bg-canvas p-6">
          <p className="text-body-sm text-muted">{collection.description}</p>
          <p className="mt-2 text-caption text-faint">
            {words.length} word{words.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      {words.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <WordCard key={word.id} word={word} showProgress />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Empty collection"
          description={`No words in ${collection.name} yet. Add words and tag them to this collection!`}
        />
      )}
    </AppLayout>
  );
}
