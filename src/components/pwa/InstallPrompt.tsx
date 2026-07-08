"use client";

import { Download, X } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { cn } from "@/lib/utils";

interface InstallPromptProps {
  className?: string;
  variant?: "card" | "banner";
  onDismiss?: () => void;
}

export function InstallPrompt({
  className,
  variant = "card",
  onDismiss,
}: InstallPromptProps) {
  const { canInstall, isInstalled, isIOSDevice, install, hasNativePrompt } =
    useInstallPrompt();

  if (isInstalled || !canInstall) return null;

  const handleInstall = async () => {
    if (hasNativePrompt) {
      await install();
    }
  };

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "install-banner flex items-center gap-3 border-b border-hairline bg-canvas px-4 py-3",
          className,
        )}
      >
        <div className="flex-1 min-w-0">
          <p className="text-body-sm font-medium text-foreground">Install WordNest</p>
          <p className="text-caption text-muted truncate">
            {isIOSDevice
              ? "Tap Share → Add to Home Screen"
              : "Add to your home screen"}
          </p>
        </div>
        {hasNativePrompt ? (
          <button onClick={handleInstall} className="btn-primary shrink-0 !py-2 !px-4 !text-sm">
            <Download className="h-4 w-4" />
            Install
          </button>
        ) : (
          <span className="badge-pill shrink-0">iOS</span>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-faint hover:bg-background"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("feature-card !p-4", className)}>
      <p className="text-eyebrow text-foreground">Install WordNest</p>
      <p className="mt-1 text-caption text-muted">
        {isIOSDevice
          ? "In Safari: Share → Add to Home Screen"
          : "Use it like a native app on your phone"}
      </p>
      {hasNativePrompt && (
        <button onClick={handleInstall} className="btn-primary mt-3 w-full !text-sm">
          <Download className="h-4 w-4" />
          Install app
        </button>
      )}
    </div>
  );
}
