"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const shown = sessionStorage.getItem("wordnest-splash-shown");
    if (shown) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      sessionStorage.setItem("wordnest-splash-shown", "1");
      setVisible(false);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="splash-screen fixed inset-0 z-[100] flex flex-col items-center justify-center px-8">
      <div className="splash-screen-glow" aria-hidden />
      <BrandLogo size="xl" variant="mark" priority className="splash-screen-logo" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">WordNest</h1>
      <p className="mt-2 text-center text-sm text-muted">Your personal vocabulary vault</p>
    </div>
  );
}
