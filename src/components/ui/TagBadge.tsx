import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  active?: boolean;
  size?: "sm" | "md";
}

export function TagBadge({ tag, onClick, active, size = "sm" }: TagBadgeProps) {
  const Component = onClick ? "button" : "span";
  return (
    <Component
      onClick={onClick}
      className={cn(
        "inline-flex items-center font-semibold transition-colors",
        size === "sm" ? "text-eyebrow px-2 py-0.5" : "text-caption px-2.5 py-1",
        active
          ? "badge-pill !bg-primary !text-on-primary !border-primary"
          : "badge-pill",
        onClick && "cursor-pointer hover:border-primary/40",
      )}
    >
      #{tag}
    </Component>
  );
}
