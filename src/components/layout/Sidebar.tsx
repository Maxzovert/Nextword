"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Library,
  PlusCircle,
  RotateCcw,
  FolderOpen,
  User,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { IconBadge } from "@/components/ui/IconBadge";

const navItems = [
  { href: "/", label: "Home", icon: Home, color: "#0075de" },
  { href: "/library", label: "Library", icon: Library, color: "#62aef0" },
  { href: "/add", label: "Add", icon: PlusCircle, color: "#1aae39" },
  { href: "/review", label: "Review", icon: RotateCcw, color: "#2a9d99" },
  { href: "/collections", label: "Collections", icon: FolderOpen, color: "#d6b6f6" },
  { href: "/profile", label: "Profile", icon: User, color: "#ff64c8" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-hairline lg:bg-canvas lg:px-4 lg:py-6">
      <div className="mb-8 px-1">
        <Link href="/" className="flex items-center gap-3">
          <IconBadge icon={BookOpen} color="#0075de" size="md" className="!rounded-xl" />
          <div>
            <h1 className="text-[15px] font-semibold text-foreground">WordNest</h1>
            <p className="text-[11px] font-medium text-faint">Vocabulary vault</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon, color }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "text-foreground shadow-sm"
                  : "text-muted hover:bg-background hover:text-foreground",
              )}
              style={
                active
                  ? {
                      backgroundColor: `color-mix(in srgb, ${color} 12%, white)`,
                      borderLeft: `3px solid ${color}`,
                    }
                  : undefined
              }
            >
              <Icon
                className="h-4 w-4"
                style={active ? { color } : undefined}
                strokeWidth={active ? 2.4 : 1.8}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-1">
        <InstallPrompt />
      </div>
    </aside>
  );
}
