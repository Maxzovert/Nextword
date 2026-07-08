"use client";

import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNavigation } from "./BottomNavigation";
import { MobileHeader } from "./MobileHeader";
import { FloatingDecorations } from "@/components/ui/FloatingDecorations";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative min-h-dvh w-full bg-background">
      <FloatingDecorations />
      <MobileHeader />
      <div className="relative flex min-h-dvh w-full">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="main-content w-full min-w-0 flex-1 px-5 sm:px-6 md:px-8 lg:pb-8 lg:pt-6">
            <div className="mx-auto w-full min-w-0 max-w-5xl">{children}</div>
          </main>
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
}
