"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function GalleryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: GalleryPaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const push = (page: number | "...") => pages.push(page);

  const windowSize = 1;
  const left = Math.max(2, currentPage - windowSize);
  const right = Math.min(totalPages - 1, currentPage + windowSize);

  push(1);
  if (left > 2) push("...");
  for (let i = left; i <= right; i++) push(i);
  if (right < totalPages - 1) push("...");
  if (totalPages > 1) push(totalPages);

  return (
    <div className="mt-6 flex justify-center">
      <nav className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="上一页"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "min-w-9",
                page === currentPage && "pointer-events-none",
              )}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="下一页"
        >
          <ChevronRight className="size-4" />
        </Button>
      </nav>
    </div>
  );
}
