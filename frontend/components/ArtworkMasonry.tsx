"use client";

import { useMemo } from "react";
import { MasonryPhotoAlbum, type Photo } from "react-photo-album";
import "react-photo-album/masonry.css";
import { ArtworkCard } from "@/components/ArtworkCard";
import type { Artwork } from "@/types";

type ArtworkPhoto = Photo & { artwork: Artwork };

interface ArtworkMasonryProps {
  artworks: Artwork[];
  spacing?: number;
}

export function ArtworkMasonry({
  artworks,
  spacing = 24,
}: ArtworkMasonryProps) {
  const photos = useMemo<ArtworkPhoto[]>(
    () =>
      artworks.map((artwork) => ({
        src: artwork.imageUrl,
        width: artwork.imageWidth,
        height: artwork.imageHeight,
        alt: artwork.title,
        artwork,
      })),
    [artworks],
  );

  return (
    <MasonryPhotoAlbum
      photos={photos}
      spacing={spacing}
      padding={0}
      columns={(containerWidth) => {
        if (containerWidth < 640) return 2;
        if (containerWidth < 1024) return 3;
        return 4;
      }}
      defaultContainerWidth={1280}
      render={{
        photo: (_props, { photo }) => (
          <div className="w-full">
            <ArtworkCard
              artwork={photo.artwork}
              aspectRatio={photo.width / photo.height}
            />
          </div>
        ),
      }}
    />
  );
}
