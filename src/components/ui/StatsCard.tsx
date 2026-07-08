import { type LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  stickerColor?: string;
  variant?: "row" | "compact";
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  stickerColor = "#62aef0",
  variant = "row",
  className,
}: StatsCardProps) {
  if (variant === "compact") {
    return (
      <div className={cn("surface-card flex flex-col items-center px-3 py-4 text-center sm:py-5", className)}>
        <IconBadge icon={icon} color={stickerColor} size="md" />
        <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-1 text-xs font-medium leading-snug text-muted">{label}</p>
      </div>
    );
  }

  return (
    <div className={cn("surface-card flex items-center gap-3 p-3.5 sm:gap-4 sm:p-4", className)}>
      <IconBadge icon={icon} color={stickerColor} size="lg" />
      <div className="min-w-0">
        <p className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {value}
        </p>
        <p className="truncate text-xs font-medium text-muted sm:text-sm">{label}</p>
      </div>
    </div>
  );
}
