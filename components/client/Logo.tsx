"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  light?: boolean;
}

export default function Logo({
  className,
  size = "md",
  light = false,
}: LogoProps) {
  const dimensions = {
    sm: { width: 120, height: 40 },
    md: { width: 180, height: 60 },
    lg: { width: 240, height: 80 },
    xl: { width: 320, height: 106 },
  };

  const logoSrc = light ? "/logo-fluxion-light.svg" : "/logo-fluxion.svg";

  return (
    <Link
      href="#"
      className={cn(
        "flex items-center transition-opacity hover:opacity-90",
        className,
      )}
    >
      <Image
        src={"/images/Fluxion-logo.png"}
        alt="FLUXION - Agence Technologique"
        width={dimensions[size].width}
        height={dimensions[size].height}
        priority={size === "md" || size === "sm"}
        className={cn(
          "object-contain transition-all",
          light && "brightness-0 invert",
        )}
      />
    </Link>
  );
}
