import Link from "next/link";
import {
  BookOpen,
  Brain,
  Briefcase,
  Film,
  Scale,
  Sparkles,
  Sun,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Collection } from "@/lib/types";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  brain: Brain,
  scale: Scale,
  film: Film,
  book: BookOpen,
  sun: Sun,
  sparkles: Sparkles,
};

interface CollectionCardProps {
  collection: Collection;
  variant?: "scroll" | "grid";
  className?: string;
}

export function CollectionCard({
  collection,
  variant = "scroll",
  className,
}: CollectionCardProps) {
  const Icon = iconMap[collection.icon] ?? Sparkles;

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={cn(
        "group surface-card flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-notion",
        variant === "scroll"
          ? "w-[10rem] shrink-0 sm:w-[11.5rem]"
          : "w-full",
        className,
      )}
    >
      <div
        className="flex flex-col items-center px-4 pb-3 pt-4"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, ${collection.color} 28%, white) 0%, color-mix(in srgb, ${collection.color} 8%, white) 100%)`,
        }}
      >
        <IconBadge
          icon={Icon}
          color={collection.color}
          size="lg"
          className="!rounded-2xl shadow-sm"
        />
      </div>
      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-1">
        <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary sm:text-base">
          {collection.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-xs text-muted">
            {collection.wordIds.length} word
            {collection.wordIds.length !== 1 ? "s" : ""}
          </p>
          <ArrowRight className="h-3.5 w-3.5 text-faint transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}
