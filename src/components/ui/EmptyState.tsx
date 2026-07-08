import { type LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  iconColor?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  iconColor = "#d6b6f6",
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("empty-state-card flex flex-col items-center text-center", className)}>
      <IconBadge icon={icon} color={iconColor} size="xl" className="mb-4 !rounded-2xl" />
      <h3 className="text-base font-semibold text-foreground sm:text-lg">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
