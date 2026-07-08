"use client";

import Link from "next/link";
import { BookOpen, RotateCcw, FolderOpen } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/utils";

const actions = [
  {
    href: "/library",
    label: "Library",
    icon: BookOpen,
    color: "#62aef0",
  },
  {
    href: "/review",
    label: "Review",
    icon: RotateCcw,
    color: "#2a9d99",
  },
  {
    href: "/collections",
    label: "Collections",
    icon: FolderOpen,
    color: "#d6b6f6",
  },
];

export function QuickActions({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {actions.map(({ href, label, icon, color }) => (
        <Link
          key={href}
          href={href}
          className="quick-action-chip group"
        >
          <IconBadge icon={icon} color={color} size="md" />
          <span className="mt-3 text-xs font-semibold leading-snug text-foreground group-hover:text-primary">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
