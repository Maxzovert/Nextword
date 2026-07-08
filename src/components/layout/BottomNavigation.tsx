"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Plus, RotateCcw, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home, color: "#0075de" },
  { href: "/library", label: "Library", icon: Library, color: "#62aef0" },
  { href: "/add", label: "Add", icon: Plus, highlight: true },
  { href: "/review", label: "Review", icon: RotateCcw, color: "#2a9d99" },
  { href: "/profile", label: "Profile", icon: User, color: "#d6b6f6" },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-canvas/95 backdrop-blur-xl lg:hidden">
      <div className="bottom-nav-inner flex items-center justify-around px-3 pt-2.5">
        {navItems.map(({ href, label, icon: Icon, highlight, color }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="relative flex min-h-[60px] min-w-0 flex-1 flex-col items-center justify-center gap-1.5 px-1 py-1 active:opacity-80"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                  highlight && "bg-primary text-on-primary shadow-sm",
                  !highlight && active && "shadow-sm",
                )}
                style={
                  !highlight && active
                    ? {
                        backgroundColor: `color-mix(in srgb, ${color} 14%, white)`,
                        color,
                      }
                    : !highlight
                      ? { color: "var(--color-faint)" }
                      : undefined
                }
              >
                <Icon
                  className="h-5 w-5"
                  style={!highlight && active ? { color } : undefined}
                  strokeWidth={active || highlight ? 2.4 : 1.8}
                />
              </div>
              <span
                className={cn(
                  "max-w-full truncate text-[11px] font-medium leading-normal",
                  highlight && "text-primary",
                  !highlight && active && "text-foreground",
                  !highlight && !active && "text-faint",
                )}
              >
                {label}
              </span>
              {!highlight && active && (
                <span
                  className="absolute bottom-1 h-0.5 w-5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
