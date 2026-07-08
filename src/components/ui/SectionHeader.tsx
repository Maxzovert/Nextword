import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  action?: { href: string; label: string };
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  iconColor = "#0075de",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-4", className)}>
      <div className="flex min-w-0 items-center gap-3.5">
        {icon && <IconBadge icon={icon} color={iconColor} size="md" />}
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-snug tracking-tight text-foreground sm:text-base">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <Link href={action.href} className="link-pill shrink-0">
          {action.label}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
