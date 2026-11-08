import Image from "next/image";
import Link from "next/link";
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-x-0 bottom-0 p-3.5">
              <p className="truncate text-sm font-medium text-white/90">
                {artwork.artist}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
