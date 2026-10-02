import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { Artwork } from "@/types";

interface ArtworkCardProps {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/artworks/${artwork.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {artwork.category && (
            <span className="absolute left-3 top-3 rounded-full bg-[#f4efe6]/90 px-3 py-1 text-xs font-semibold text-[#4a3f35] shadow-sm">
              {artwork.category}
            </span>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex flex-col items-center gap-2 text-white">
              <Eye className="size-6" />
              <span className="text-sm">查看详情</span>
            </div>
          </div>
        </div>
        <div className="p-3.5">
          <h3 className="truncate text-base font-semibold text-foreground">
            {artwork.title}
          </h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            艺术家：{artwork.artist}
          </p>
        </div>
      </Link>
    </div>
  );
}
