"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/library": "Library",
  "/add": "Add word",
  "/review": "Review",
  "/collections": "Collections",
  "/profile": "Profile",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];

  if (pathname.startsWith("/word/")) return "Word";
  if (pathname.startsWith("/collections/")) return "Collection";

  const match = Object.entries(pageTitles).find(
    ([path]) => path !== "/" && pathname.startsWith(path),
  );
  return match?.[1] ?? "WordNest";
}

export function MobileHeader() {
  const pathname = usePathname();
  const currentPage = getPageTitle(pathname);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-hairline/80 bg-canvas/95 backdrop-blur-xl pt-safe lg:hidden">
      <div className="flex h-14 items-center px-5 py-2">
        <Link href="/" className="flex min-w-0 items-center gap-3.5">
          <IconBadge icon={BookOpen} color="#0075de" size="sm" className="rounded-lg!" />
          <div className="min-w-0 py-0.5">
            <span className="block truncate text-[15px] font-semibold leading-snug text-foreground">
              {currentPage}
            </span>
            <span className="mt-0.5 block text-xs font-medium leading-snug text-faint">
              WordNest
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
