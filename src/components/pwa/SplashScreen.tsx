"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";

function hasSeenSplash() {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem("wordnest-splash-shown") === "1";
  } catch {
    return true;
  }
}

export function SplashScreen() {
  const [visible, setVisible] = useState(() => !hasSeenSplash());

  useEffect(() => {
    if (!visible) return;

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem("wordnest-splash-shown", "1");
      } catch {
        // Ignore storage errors in restrictive PWA contexts.
      }
      setVisible(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="splash-screen pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center px-8"
      aria-hidden
    >
      <div className="splash-screen-glow" aria-hidden />
      <BrandLogo size="xl" variant="mark" priority className="splash-screen-logo" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">WordNest</h1>
      <p className="mt-2 text-center text-sm text-muted">Your personal vocabulary vault</p>
    </div>
  );
}
