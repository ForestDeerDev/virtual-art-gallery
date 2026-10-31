"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import artworkApi from "@/api/artwork";
import { createGallery } from "@/lib/three/createGallery";
import { GalleryControls } from "./GalleryControls";
import type {
  GalleryArtwork,
  GalleryControlState,
  GalleryInstance,
} from "@/types";

const DEFAULT_CONTROLS: GalleryControlState = {
  moveSpeed: 0.5,
  mouseSensitivity: 0.3,
  autoRotate: false,
};

const MIN_LOADING_MS = 1200;

export default function VirtualGalleryScene() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<GalleryInstance | null>(null);

  const controlsRef = useRef<GalleryControlState>(DEFAULT_CONTROLS);
  const [controls, setControls] =
    useState<GalleryControlState>(DEFAULT_CONTROLS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingStartRef = useRef(0);
  const loadingTimerRef = useRef<number | null>(null);

  const {
    data: artworks,
    isError,
    refetch,
  } = useQuery<GalleryArtwork[]>({
    queryKey: ["artworks", "virtual-gallery"],
    queryFn: async () => {
      const response = await artworkApi.getArtworks({
        page: 0,
        pageSize: 20,
      });
      return response.data.map((artwork) => ({
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artist,
        category: artwork.category,
        imageUrl: artwork.imageUrl,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const getControls = useCallback(() => controlsRef.current, []);

  const updateControls = (updates: Partial<GalleryControlState>) => {
    controlsRef.current = { ...controlsRef.current, ...updates };
    setControls(controlsRef.current);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !artworks) return;

    const gallery = createGallery({
      container,
      artworks,
      getControls,
      config: {
        roomWidth: 20,
        roomHeight: 5,
        roomDepth: 15,
        cameraHeight: 1.7,
      },
      onArtworkClick: (id: number) => router.push(`/artworks/${id}`),
      onLoadingStart: () => {
        loadingStartRef.current = performance.now();
        setIsLoading(true);
        setLoadingProgress(0);
      },
      onLoadingProgress: (progress: number) => {
        setLoadingProgress(progress);
      },
      onLoadingComplete: () => {
        const elapsed = performance.now() - loadingStartRef.current;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
        if (loadingTimerRef.current !== null) {
          window.clearTimeout(loadingTimerRef.current);
        }
        loadingTimerRef.current = window.setTimeout(() => {
          setIsLoading(false);
          loadingTimerRef.current = null;
        }, remaining);
      },
    });
    galleryRef.current = gallery;
    loadingStartRef.current = performance.now();
    gallery.mount();

    return () => {
      if (loadingTimerRef.current !== null) {
        window.clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
      gallery.dispose();
      galleryRef.current = null;
    };
  }, [artworks, getControls, router]);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#2a2a3e]">
      <div ref={containerRef} className="h-full w-full" />

      <Link
        href="/gallery"
        className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/60 px-3 py-2 text-sm text-white/85 backdrop-blur-md transition-colors hover:border-amber-400/60 hover:text-amber-300"
      >
        <ArrowLeft className="size-4" />
        返回画廊
      </Link>

      <GalleryControls
        controls={controls}
        onMoveSpeedChange={(value) => updateControls({ moveSpeed: value })}
        onMouseSensitivityChange={(value) =>
          updateControls({ mouseSensitivity: value })
        }
        onReset={() => galleryRef.current?.resetCamera()}
        onToggleRotate={() =>
          updateControls({ autoRotate: !controlsRef.current.autoRotate })
        }
      />

      {isError ? (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-black/80">
          <p className="text-lg text-white/90">艺术作品加载失败</p>
          <button
            onClick={() => refetch()}
            className="rounded-lg border border-amber-400/60 px-4 py-2 text-sm text-amber-300 transition-colors hover:bg-amber-400/10"
          >
            重新加载
          </button>
        </div>
      ) : (
        isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-black/80">
            <Loader2 className="size-10 animate-spin text-amber-400" />
            <p className="text-lg text-white">正在加载艺术馆...</p>
            <div className="h-1.5 w-72 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-200"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}
