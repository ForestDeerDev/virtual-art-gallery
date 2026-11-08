"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  username?: string;
  size?: number;
  className?: string;
}

export function Avatar({
  src,
  username = "",
  size = 64,
  className,
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (src && failedSrc !== src) {
    return (
      <Image
        src={src}
        alt={username}
        width={size}
        height={size}
        unoptimized
        onError={() => setFailedSrc(src)}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-semibold text-white",
        className,
      )}
    >
      {username.charAt(0).toUpperCase()}
    </div>
  );
}
