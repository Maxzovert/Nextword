import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

interface BrandLogoProps {
  size?: BrandLogoSize;
  variant?: "full" | "mark";
  className?: string;
  priority?: boolean;
}

const sizeMap: Record<BrandLogoSize, number> = {
  xs: 28,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 112,
};

export function BrandLogo({
  size = "md",
  variant = "mark",
  className,
  priority = false,
}: BrandLogoProps) {
  const px = sizeMap[size];
  const src = variant === "full" ? "/icons/icon.svg" : "/icons/logo-mark.svg";
  const radius = variant === "full" ? px * 0.22 : px * 0.22;

  return (
    <Image
      src={src}
      alt="WordNest"
      width={px}
      height={px}
      priority={priority}
      className={cn("shrink-0", className)}
      style={{ width: px, height: px, borderRadius: radius }}
    />
  );
}
