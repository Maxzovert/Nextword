import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconBadgeVariant = "soft" | "solid" | "glass";
type IconBadgeSize = "sm" | "md" | "lg" | "xl";

interface IconBadgeProps {
  icon: LucideIcon;
  color?: string;
  variant?: IconBadgeVariant;
  size?: IconBadgeSize;
  className?: string;
  iconClassName?: string;
}

const sizeMap: Record<
  IconBadgeSize,
  { box: string; icon: string; stroke: number }
> = {
  sm: { box: "h-7 w-7", icon: "h-3.5 w-3.5", stroke: 2 },
  md: { box: "h-9 w-9", icon: "h-4 w-4", stroke: 2.1 },
  lg: { box: "h-11 w-11", icon: "h-5 w-5", stroke: 2.2 },
  xl: { box: "h-14 w-14", icon: "h-6 w-6", stroke: 2.2 },
};

export function IconBadge({
  icon: Icon,
  color = "#0075de",
  variant = "soft",
  size = "md",
  className,
  iconClassName,
}: IconBadgeProps) {
  const s = sizeMap[size];

  const style =
    variant === "solid"
      ? { backgroundColor: color, color: "#ffffff" }
      : variant === "glass"
        ? { backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff" }
        : {
            backgroundColor: `color-mix(in srgb, ${color} 14%, white)`,
            color,
            borderColor: `color-mix(in srgb, ${color} 22%, transparent)`,
          };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        variant === "soft" && "border",
        s.box,
        className,
      )}
      style={style}
    >
      <Icon
        className={cn(s.icon, iconClassName)}
        style={variant === "solid" || variant === "glass" ? { color: "inherit" } : { color }}
        strokeWidth={s.stroke}
      />
    </div>
  );
}

interface LetterAvatarProps {
  letter: string;
  color?: string;
  size?: IconBadgeSize;
  className?: string;
}

export function LetterAvatar({
  letter,
  color = "#0075de",
  size = "md",
  className,
}: LetterAvatarProps) {
  const s = sizeMap[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border font-bold uppercase",
        s.box,
        className,
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 14%, white)`,
        borderColor: `color-mix(in srgb, ${color} 22%, transparent)`,
        color,
        fontSize: size === "sm" ? "11px" : size === "md" ? "13px" : size === "lg" ? "15px" : "18px",
      }}
    >
      {letter.charAt(0)}
    </div>
  );
}
