"use client";

import { useState, useMemo } from "react";
import { Search, Heart, Clock, ArrowDownAZ } from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { WordCard } from "@/components/words/WordCard";
import { LibraryWordRow } from "@/components/words/LibraryWordRow";
import { TagBadge } from "@/components/ui/TagBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { IconBadge } from "@/components/ui/IconBadge";
import { useAppData } from "@/context/AppDataContext";
import { BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "oldest" | "favorites";

const sortOptions: { value: SortOption; label: string; icon: typeof Clock }[] = [
  { value: "newest", label: "Newest", icon: Clock },
  { value: "oldest", label: "Oldest", icon: ArrowDownAZ },
  { value: "favorites", label: "Favorites", icon: Heart },
];

export default function LibraryPage() {
  const { data } = useAppData();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredWords = useMemo(() => {
    let result = [...data.words];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q) ||
          w.tags.some((t) => t.includes(q)),
      );
    }

    if (selectedTag) {
      result = result.filter((w) => w.tags.includes(selectedTag));
    }

    if (sort === "favorites") {
      result = result.filter((w) => w.isFavorite);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === "oldest" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [data.words, search, sort, selectedTag]);

  const hasFilters = Boolean(search || selectedTag || sort === "favorites");

  return (
    <AppLayout>
      <PageHeader
        title="Word Library"
        subtitle="Your personal word collection"
        icon={BookOpen}
        iconColor="#62aef0"
        mobileHidden
      />

      <div className="mb-4 flex items-center gap-4 py-1 lg:hidden">
        <IconBadge icon={BookOpen} color="#62aef0" size="md" />
        <div>
          <p className="text-sm font-semibold leading-snug text-foreground">
            {data.words.length} word{data.words.length !== 1 ? "s" : ""} saved
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {filteredWords.length} showing
          </p>
        </div>
      </div>

      <div className="mb-4 search-shell">
        <Search className="h-4 w-4 shrink-0 text-faint" strokeWidth={2} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search words, meanings, tags..."
        />
      </div>

      <div className="scroll-row mb-4 flex gap-2">
        {sortOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSort(value)}
            className={cn("filter-chip", sort === value && "filter-chip-active")}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>

      {data.tags.length > 0 && (
        <div className="scroll-row mb-5 flex gap-2">
          {data.tags.map((tag) => (
            <TagBadge
              key={tag}
              tag={tag}
              active={selectedTag === tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            />
          ))}
        </div>
      )}

      {filteredWords.length > 0 ? (
        <>
          <div className="space-y-2.5 lg:hidden">
            {filteredWords.map((word) => (
              <LibraryWordRow key={word.id} word={word} />
            ))}
          </div>
          <div className="hidden grid-cols-2 gap-4 lg:grid xl:grid-cols-3">
            {filteredWords.map((word) => (
              <WordCard key={word.id} word={word} showProgress />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={BookOpen}
          iconColor="#62aef0"
          title={hasFilters ? "No words found" : "Your library is empty"}
          description={
            hasFilters
              ? "Try a different search or clear your filters"
              : "Add your first word and it will show up here"
          }
          action={
            !hasFilters ? (
              <Link href="/add" className="btn-primary">
                <Plus className="h-4 w-4" /> Add a word
              </Link>
            ) : undefined
          }
        />
      )}
    </AppLayout>
  );
}
