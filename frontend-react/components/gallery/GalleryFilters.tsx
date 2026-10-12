"use client";

import { useState } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";
import { Popover } from "@base-ui/react/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GalleryFilterState } from "@/types";

interface GalleryFiltersProps {
  filters: GalleryFilterState;
  categories: string[];
  categoriesLoading: boolean;
  availableTags: string[];
  onChange: (filters: GalleryFilterState) => void;
  onReset: () => void;
}

const SORT_OPTIONS = [
  { label: "最新", value: "latest" },
  { label: "最受欢迎", value: "popular" },
  { label: "标题", value: "title" },
];

function SelectField({
  value,
  onChange,
  children,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={loading}
      className={cn(
        "h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow]",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
    >
      {children}
    </select>
  );
}

export function GalleryFilters({
  filters,
  categories,
  categoriesLoading,
  availableTags,
  onChange,
  onReset,
}: GalleryFiltersProps) {
  const [tagsOpen, setTagsOpen] = useState(false);
  return (
    <div className="mb-8">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SelectField
              value={filters.category}
              loading={categoriesLoading}
              onChange={(value) => onChange({ ...filters, category: value })}
            >
              <option value="">分类</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </SelectField>

            <SelectField
              value={filters.sortBy}
              onChange={(value) => onChange({ ...filters, sortBy: value })}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SelectField>

            {availableTags.length > 0 && (
              <Popover.Root open={tagsOpen} onOpenChange={setTagsOpen}>
                <Popover.Trigger
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-between gap-1 px-2.5 font-normal",
                        filters.tags &&
                          "border-indigo-500/50 text-indigo-600 dark:text-indigo-400",
                      )}
                    />
                  }
                >
                  <span className="truncate">{filters.tags || "标签"}</span>
                  <ChevronDown className="size-4 opacity-50 transition-transform aria-expanded:rotate-180" />
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Positioner align="start" sideOffset={8}>
                    <Popover.Popup
                      className={cn(
                        "z-50 max-h-64 w-72 overflow-y-auto rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-lg",
                        "origin-[var(--transform-origin)] transition-[opacity,transform] duration-200 ease-out",
                        "data-[starting-style]:-translate-y-1 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0",
                        "data-[ending-style]:-translate-y-1 data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0",
                      )}
                    >
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          aria-pressed={!filters.tags}
                          onClick={() => {
                            onChange({ ...filters, tags: "" });
                            setTagsOpen(false);
                          }}
                          className={cn(
                            "h-8 rounded-full px-3.5 text-sm transition-all duration-200",
                            !filters.tags
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground",
                          )}
                        >
                          全部
                        </button>
                        {availableTags.map((tag) => {
                          const active = filters.tags === tag;
                          return (
                            <button
                              key={tag}
                              type="button"
                              aria-pressed={active}
                              onClick={() => {
                                onChange({
                                  ...filters,
                                  tags: active ? "" : tag,
                                });
                                setTagsOpen(false);
                              }}
                              className={cn(
                                "h-8 rounded-full px-3.5 text-sm transition-all duration-200",
                                active
                                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                              )}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            )}

            <Button variant="outline" onClick={onReset} className="gap-2">
              <RefreshCw className="size-4" />
              重置
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
