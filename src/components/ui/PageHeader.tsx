import { type LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  action?: React.ReactNode;
  className?: string;
  mobileHidden?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  iconColor = "#0075de",
  action,
  className,
  mobileHidden = false,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-6 flex items-start justify-between gap-4",
        mobileHidden && "hidden lg:flex",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <IconBadge icon={icon} color={iconColor} size="lg" className="!rounded-2xl" />
        <div className="min-w-0">
          <h1 className="text-heading-2 text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-body-sm text-muted">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </header>
  );
}
