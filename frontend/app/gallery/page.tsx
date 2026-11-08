"use client";

import { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Wand2,
  Loader2,
  RefreshCw,
  Box,
  X,
  Funnel,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GalleryPagination } from "@/components/gallery/GalleryPagination";
import {
  useGallery,
  useGalleryCategories,
  useGalleryTags,
} from "@/hooks/useGallery";
import { createDefaultFilters } from "@/utils/artworkQuery";
import type { GalleryFilterState } from "@/types";

function GalleryContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: GalleryFilterState = {
    category: searchParams.get("category") ?? "",
    sortBy: searchParams.get("sortBy") ?? "latest",
    tags: searchParams.get("tags") ?? "",
    keyword: searchParams.get("keyword") ?? "",
  };

  const page = Number(searchParams.get("page") ?? "1") || 1;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasActiveFilters = Boolean(
    filters.keyword || filters.category || filters.tags,
  );

  const [searchInput, setSearchInput] = useState(filters.keyword);
  const [prevKeyword, setPrevKeyword] = useState(filters.keyword);

  if (filters.keyword !== prevKeyword) {
    setPrevKeyword(filters.keyword);
    setSearchInput(filters.keyword);
  }

  const updateParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const { data, isLoading } = useGallery(filters, page);
  const { data: categories, isLoading: categoriesLoading } =
    useGalleryCategories();
  const { data: tagsData } = useGalleryTags();
  const availableTags = tagsData ?? [];

  const artworks = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleFilterChange = (newFilters: GalleryFilterState) => {
    updateParams({
      category: newFilters.category,
      sortBy: newFilters.sortBy,
      tags: newFilters.tags,
      page: 1,
    });
  };

  const handleReset = () => {
    const defaults = createDefaultFilters();
    updateParams({
      category: defaults.category,
      sortBy: defaults.sortBy,
      tags: defaults.tags,
      keyword: "",
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
  };

  const handleSearch = useCallback(() => {
    const keyword = searchInput.trim();
    updateParams({ keyword: keyword || undefined, page: 1 });
  }, [searchInput, updateParams]);

  return (
    <div className="mx-auto max-w-page px-6 py-1 pb-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="sr-only">艺术画廊</h1>
        <div className="flex min-w-[200px] flex-1 items-center gap-1.5 max-w-xs">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSearch();
            }}
            placeholder="搜索艺术作品..."
            className="h-9 w-full min-w-0"
          />
          <Button
            variant="outline"
            onClick={handleSearch}
            size="icon-sm"
            aria-label="搜索"
            className="shrink-0"
          >
            <Search className="size-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            className={cn(
              "gap-2",
              hasActiveFilters &&
                "border-indigo-500/50 text-indigo-600 dark:text-indigo-400",
            )}
          >
            <Funnel className="size-4" />
            筛选器
          </Button>
          <Button
            variant="outline"
            render={<Link href="/virtual-gallery" />}
            nativeButton={false}
            className="gap-2"
          >
            <Wand2 className="size-4" />
            进入虚拟画廊
          </Button>
        </div>
      </div>

      {filtersOpen && (
        <GalleryFilters
          filters={filters}
          categories={categories ?? []}
          categoriesLoading={categoriesLoading}
          availableTags={availableTags}
          onChange={handleFilterChange}
          onReset={handleReset}
        />
      )}

      {(filters.keyword || filters.category || filters.tags) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {filters.keyword && (
            <button
              type="button"
              onClick={() => updateParams({ keyword: undefined, page: 1 })}
              className="inline-flex h-7 items-center gap-1.5 rounded-full bg-muted px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              关键词：{filters.keyword}
              <X className="size-3.5" />
            </button>
          )}
          {filters.category && (
            <button
              type="button"
              onClick={() => updateParams({ category: undefined, page: 1 })}
              className="inline-flex h-7 items-center gap-1.5 rounded-full bg-muted px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              分类：{filters.category}
              <X className="size-3.5" />
            </button>
          )}
          {filters.tags && (
            <button
              type="button"
              onClick={() => updateParams({ tags: undefined, page: 1 })}
              className="inline-flex h-7 items-center gap-1.5 rounded-full bg-muted px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              标签：{filters.tags}
              <X className="size-3.5" />
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <Loader2 className="size-10 animate-spin text-indigo-500" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : artworks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <Box className="size-16 text-muted-foreground/60" />
          <p className="text-muted-foreground">
            没有找到符合条件的艺术作品，请尝试调整筛选条件或搜索关键词。
          </p>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RefreshCw className="size-4" />
            重置所有筛选
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>

          <GalleryPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <Loader2 className="size-10 animate-spin text-indigo-500" />
              <p className="text-muted-foreground">加载中...</p>
            </div>
          }
        >
          <GalleryContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
