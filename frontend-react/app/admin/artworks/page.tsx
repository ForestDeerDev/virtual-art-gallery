"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  Heart,
  Image as ImageIcon,
  Layers,
  Loader2,
  Pencil,
  Plus,
  Star,
  StarOff,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import { AdminDialog } from "@/components/admin/AdminDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAdminArtworks,
  useBatchDeleteArtworks,
  useBatchUpdateArtworks,
  useCreateArtwork,
  useDeleteArtwork,
  useUpdateArtwork,
} from "@/hooks/useAdmin";
import { cn, formatDate } from "@/lib/utils";
import { TagPicker } from "@/components/TagPicker";
import type { Artwork, BatchUpdateRequest } from "@/types";

const CATEGORIES = ["油画", "水彩", "素描", "雕塑", "摄影", "数字艺术", "其他"];

const artworkFormSchema = z.object({
  title: z.string().min(1, "请输入作品标题").max(100, "标题不超过 100 字"),
  category: z.string().min(1, "请选择作品分类"),
  imageUrl: z.string().min(1, "请输入作品图片链接"),
  description: z.string().max(2000, "描述不超过 2000 字"),
  videoUrl: z.string(),
  tags: z.array(z.string()),
  dimensions: z.string().max(50, "尺寸不超过 50 字"),
  material: z.string().max(50, "材质不超过 50 字"),
  featured: z.boolean(),
});

type ArtworkFormValues = z.infer<typeof artworkFormSchema>;

const NO_CATEGORY = "";

type SortKey =
  | "title"
  | "artist"
  | "category"
  | "createTime"
  | "viewCount"
  | "likeCount";
type SortDirection = "asc" | "desc";

const SORTABLE_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "title", label: "标题" },
  { key: "artist", label: "艺术家" },
  { key: "category", label: "分类" },
  { key: "createTime", label: "创建时间" },
];

const METRIC_COLUMNS: { key: SortKey; label: string; icon: LucideIcon }[] = [
  { key: "viewCount", label: "浏览", icon: Eye },
  { key: "likeCount", label: "点赞", icon: Heart },
];

function SortHeaderButton({
  columnKey,
  label,
  icon: Icon,
  sortKey,
  sortDirection,
  onSort,
}: {
  columnKey: SortKey;
  label: string;
  icon?: LucideIcon;
  sortKey: SortKey | null;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  const isSorted = sortKey === columnKey;
  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      className="group inline-flex cursor-pointer items-center gap-1 hover:text-foreground"
    >
      {Icon && <Icon className="size-3.5" />}
      {label}
      {isSorted ? (
        sortDirection === "asc" ? (
          <ArrowUp className="size-3 text-indigo-500" />
        ) : (
          <ArrowDown className="size-3 text-indigo-500" />
        )
      ) : (
        <ArrowUpDown className="size-3 opacity-0 transition-opacity group-hover:opacity-60" />
      )}
    </button>
  );
}

function ArtworkFormDialog({
  artwork,
  onClose,
}: {
  artwork: Artwork | null;
  onClose: () => void;
}) {
  const createMutation = useCreateArtwork();
  const updateMutation = useUpdateArtwork();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: {
      title: artwork?.title ?? "",
      category: artwork?.category ?? NO_CATEGORY,
      imageUrl: artwork?.imageUrl ?? "",
      description: artwork?.description ?? "",
      videoUrl: artwork?.videoUrl ?? "",
      tags: artwork?.tags ?? [],
      dimensions: artwork?.dimensions ?? "",
      material: artwork?.material ?? "",
      featured: artwork?.featured ?? false,
    },
  });

  const imageUrlValue = useWatch({ control, name: "imageUrl" });
  const featuredValue = useWatch({ control, name: "featured" });
  const tagsValue = useWatch({ control, name: "tags" });

  const onSubmit = handleSubmit((values) => {
    const payload = {
      title: values.title.trim(),
      category: values.category,
      imageUrl: values.imageUrl.trim(),
      description: values.description.trim(),
      videoUrl: values.videoUrl.trim(),
      tags: values.tags,
      dimensions: values.dimensions.trim(),
      material: values.material.trim(),
      featured: values.featured,
    };

    if (artwork) {
      updateMutation.mutate(
        { id: artwork.id, data: payload },
        {
          onSuccess: () => {
            toast.success("作品已更新");
            onClose();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("作品已创建");
          onClose();
        },
      });
    }
  });

  return (
    <AdminDialog
      title={artwork ? "编辑作品" : "添加作品"}
      description={
        artwork ? `当前艺术家：${artwork.artist}` : "新作品将归属当前登录账号"
      }
      onClose={onClose}
      className="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            取消
          </Button>
          <Button
            type="submit"
            form="artwork-form"
            disabled={isPending}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-700"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {artwork ? "保存更改" : "创建作品"}
          </Button>
        </>
      }
    >
      <form id="artwork-form" onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">
              作品标题 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="请输入作品标题"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              作品分类 <span className="text-destructive">*</span>
            </Label>
            <select
              id="category"
              {...register("category")}
              className="h-9 w-full min-w-0 rounded-md border border-input bg-background px-2.5 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            >
              <option value={NO_CATEGORY}>请选择分类</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">
            作品图片链接 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="imageUrl"
            placeholder="https://... 或 /uploads/..."
            {...register("imageUrl")}
          />
          {errors.imageUrl && (
            <p className="text-sm text-destructive">
              {errors.imageUrl.message}
            </p>
          )}
          {imageUrlValue && (
            <div className="overflow-hidden rounded-lg border bg-muted/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrlValue}
                alt="作品预览"
                className="mx-auto max-h-56 w-full object-contain"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">作品描述</Label>
          <textarea
            id="description"
            rows={3}
            placeholder="描述这幅作品..."
            {...register("description")}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dimensions">作品尺寸</Label>
            <Input
              id="dimensions"
              placeholder="例如：100cm × 80cm"
              {...register("dimensions")}
            />
            {errors.dimensions && (
              <p className="text-sm text-destructive">
                {errors.dimensions.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="material">作品材质</Label>
            <Input
              id="material"
              placeholder="例如：布面油画"
              {...register("material")}
            />
            {errors.material && (
              <p className="text-sm text-destructive">
                {errors.material.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="videoUrl">视频链接（可选）</Label>
          <Input
            id="videoUrl"
            placeholder="https://..."
            {...register("videoUrl")}
          />
        </div>

        <div className="space-y-2">
          <Label>作品标签</Label>
          <TagPicker
            value={tagsValue}
            onChange={(updatedTags) => setValue("tags", updatedTags)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="featured"
            checked={featuredValue}
            onCheckedChange={(checked) =>
              setValue("featured", checked === true)
            }
          />
          <label
            htmlFor="featured"
            className="cursor-pointer text-sm font-medium leading-none"
          >
            设为精选作品
          </label>
        </div>
      </form>
    </AdminDialog>
  );
}

export default function AdminArtworksPage() {
  const [featuredFilter, setFeaturedFilter] = useState<
    "all" | "featured" | "normal"
  >("all");
  const { data, isLoading, isError, refetch } = useAdminArtworks(
    100,
    featuredFilter === "all" ? undefined : featuredFilter === "featured",
  );
  const deleteMutation = useDeleteArtwork();
  const batchDeleteMutation = useBatchDeleteArtworks();
  const batchUpdateMutation = useBatchUpdateArtworks();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchCategory, setBatchCategory] = useState(NO_CATEGORY);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const artworks = data?.data ?? [];
  const total = data?.total ?? 0;

  const sortedArtworks = (() => {
    if (!sortKey) return artworks;
    const direction = sortDirection === "asc" ? 1 : -1;
    return [...artworks].sort((left, right) => {
      if (sortKey === "viewCount" || sortKey === "likeCount") {
        return ((left[sortKey] ?? 0) - (right[sortKey] ?? 0)) * direction;
      }
      return (
        String(left[sortKey] ?? "").localeCompare(
          String(right[sortKey] ?? ""),
          "zh-Hans-CN",
        ) * direction
      );
    });
  })();

  const allSelected =
    sortedArtworks.length > 0 &&
    sortedArtworks.every((artwork) => selectedIds.includes(artwork.id));

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection(
        key === "viewCount" || key === "likeCount" ? "desc" : "asc",
      );
      return;
    }
    if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      setSortKey(null);
    }
  };

  const openCreateDialog = () => {
    setEditingArtwork(null);
    setDialogOpen(true);
  };

  const openEditDialog = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingArtwork(null);
  };

  const toggleSelect = (artworkId: number) => {
    setSelectedIds((prev) =>
      prev.includes(artworkId)
        ? prev.filter((id) => id !== artworkId)
        : [...prev, artworkId],
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? sortedArtworks.map((artwork) => artwork.id) : []);
  };

  const handleDelete = (artwork: Artwork) => {
    if (!confirm(`确定要删除作品 "${artwork.title}" 吗？此操作不可恢复。`)) {
      return;
    }
    deleteMutation.mutate(artwork.id, {
      onSuccess: () => {
        toast.success("作品已删除");
        setSelectedIds((prev) => prev.filter((id) => id !== artwork.id));
      },
    });
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.length} 件作品吗？`)) {
      return;
    }
    batchDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success("批量删除成功");
        setSelectedIds([]);
      },
    });
  };

  const handleBatchUpdate = () => {
    if (!batchCategory || selectedIds.length === 0) return;

    const updates: BatchUpdateRequest["updates"] = selectedIds.map((id) => ({
      id,
      data: { category: batchCategory },
    }));

    batchUpdateMutation.mutate(updates, {
      onSuccess: () => {
        toast.success("批量更新成功");
        setBatchDialogOpen(false);
        setBatchCategory(NO_CATEGORY);
        setSelectedIds([]);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">作品管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            共 {total} 件作品
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(
            [
              {
                value: "all",
                label: "全部",
                icon: ImageIcon,
                iconClass: "text-rose-500 dark:text-rose-400",
                activeClass:
                  "bg-gradient-to-br from-rose-200 to-pink-300 text-rose-950 border-rose-300/70 shadow-sm shadow-rose-300/40 dark:from-rose-500/30 dark:to-pink-500/30 dark:text-rose-100 dark:border-rose-400/30 dark:shadow-none",
                activeIconClass: "text-rose-900 dark:text-rose-200",
              },
              {
                value: "featured",
                label: "精选",
                icon: Star,
                iconClass: "text-amber-500 dark:text-amber-400",
                activeClass:
                  "bg-gradient-to-br from-amber-400 to-orange-500 text-white border-transparent shadow-lg shadow-amber-500/25",
                activeIconClass: "text-white fill-white",
              },
              {
                value: "normal",
                label: "非精选",
                icon: StarOff,
                iconClass: "text-muted-foreground",
                activeClass:
                  "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 border-slate-300/70 shadow-sm shadow-slate-300/40 dark:from-slate-600/40 dark:to-slate-500/40 dark:text-slate-200 dark:border-slate-400/30 dark:shadow-none",
                activeIconClass: "text-slate-600 dark:text-slate-300",
              },
            ] as const
          ).map((option) => {
            const isActive = featuredFilter === option.value;
            const IconComp = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFeaturedFilter(option.value)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  isActive
                    ? option.activeClass
                    : "border-border bg-background hover:border-indigo-300 dark:hover:border-indigo-600",
                )}
              >
                <IconComp
                  className={cn(
                    "size-3.5",
                    isActive ? option.activeIconClass : option.iconClass,
                  )}
                />
                {option.label}
              </button>
            );
          })}
          <Button
            size="sm"
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-rose-200 to-pink-300 text-rose-950 shadow-sm shadow-rose-300/40 hover:from-rose-300 hover:to-pink-400 dark:from-rose-500/30 dark:to-pink-500/30 dark:text-rose-100 dark:shadow-none dark:hover:from-rose-500/40 dark:hover:to-pink-500/40"
          >
            <Plus className="size-4" />
            添加作品
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="size-8 animate-spin text-indigo-500" />
              <p className="text-sm text-muted-foreground">加载作品列表中...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <p className="text-sm text-muted-foreground">
                作品列表加载失败，请稍后重试。
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                重新加载
              </Button>
            </div>
          ) : artworks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <ImageIcon className="size-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                暂无作品，点击右上角「添加作品」创建第一件作品。
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                    <th className="w-12 px-6 py-2.5">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={(checked) =>
                          toggleSelectAll(checked === true)
                        }
                        aria-label="全选作品"
                      />
                    </th>
                    <th className="w-20 px-3 py-2.5" />
                    {SORTABLE_COLUMNS.map((column) => {
                      const isSorted = sortKey === column.key;
                      return (
                        <th
                          key={column.key}
                          className="px-3 py-2.5 font-medium"
                          aria-sort={
                            isSorted
                              ? sortDirection === "asc"
                                ? "ascending"
                                : "descending"
                              : undefined
                          }
                        >
                          <SortHeaderButton
                            columnKey={column.key}
                            label={column.label}
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            onSort={toggleSort}
                          />
                        </th>
                      );
                    })}
                    <th
                      className="px-3 py-2.5 font-medium"
                      aria-sort={
                        sortKey === "viewCount" || sortKey === "likeCount"
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : undefined
                      }
                    >
                      <span className="grid grid-cols-[4.5rem_4rem] items-center gap-x-2">
                        {METRIC_COLUMNS.map((column) => (
                          <SortHeaderButton
                            key={column.key}
                            columnKey={column.key}
                            label={column.label}
                            icon={column.icon}
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            onSort={toggleSort}
                          />
                        ))}
                      </span>
                    </th>
                    <th className="px-6 py-2.5 text-right" />
                  </tr>
                </thead>
                <tbody>
                  {sortedArtworks.map((artwork) => {
                    const isSelected = selectedIds.includes(artwork.id);
                    const isDeleting =
                      deleteMutation.isPending &&
                      deleteMutation.variables === artwork.id;

                    return (
                      <tr
                        key={artwork.id}
                        className={cn(
                          "border-b last:border-0 hover:bg-muted/30",
                          isSelected && "bg-indigo-500/5",
                        )}
                      >
                        <td className="px-6 py-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelect(artwork.id)}
                            aria-label={`选择 ${artwork.title}`}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <Link
                            href={`/artworks/${artwork.id}`}
                            className="relative block size-14 overflow-hidden rounded-lg bg-muted transition-opacity hover:opacity-80"
                          >
                            {artwork.imageUrl ? (
                              <Image
                                src={artwork.imageUrl}
                                alt={artwork.title}
                                width={56}
                                height={56}
                                unoptimized
                                className="size-full object-cover"
                              />
                            ) : (
                              <span className="flex size-full items-center justify-center text-muted-foreground">
                                <ImageIcon className="size-5" />
                              </span>
                            )}
                          </Link>
                        </td>
                        <td className="max-w-[220px] px-3 py-3">
                          <p className="flex items-center gap-1.5 font-medium">
                            <Link
                              href={`/artworks/${artwork.id}`}
                              className="truncate transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              {artwork.title}
                            </Link>
                            {artwork.featured && (
                              <span
                                title="精选作品"
                                className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
                              >
                                <Star className="size-3 fill-current" />
                                精选
                              </span>
                            )}
                          </p>
                          <p className="text-xs tabular-nums text-muted-foreground">
                            #{artwork.id}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">
                          {artwork.artist}
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-600 dark:text-indigo-400">
                            {artwork.category}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 tabular-nums text-muted-foreground">
                          {formatDate(artwork.createTime)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <div className="grid grid-cols-[4.5rem_4rem] items-center gap-x-2 text-xs tabular-nums text-muted-foreground">
                            <span
                              className="inline-flex items-center gap-1"
                              title="浏览量（PV，按访问次数累计）"
                            >
                              <Eye className="size-3.5 shrink-0" />
                              {artwork.viewCount.toLocaleString("zh-CN")}
                            </span>
                            <span
                              className="inline-flex items-center gap-1"
                              title="点赞数"
                            >
                              <Heart className="size-3.5 shrink-0" />
                              {artwork.likeCount.toLocaleString("zh-CN")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openEditDialog(artwork)}
                              title="编辑作品"
                              aria-label="编辑作品"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDelete(artwork)}
                              disabled={isDeleting}
                              title="删除作品"
                              aria-label="删除作品"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              {isDeleting ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedIds.length > 0 && (
        <div className="sticky bottom-4 z-30 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-amber-300/70 bg-amber-50/95 px-4 py-1.5 shadow-lg shadow-amber-500/10 backdrop-blur dark:border-amber-500/30 dark:bg-amber-950/85">
            <p className="whitespace-nowrap text-sm">
              已选择{" "}
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {selectedIds.length}
              </span>{" "}
              件作品
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBatchDelete}
                disabled={batchDeleteMutation.isPending}
              >
                {batchDeleteMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                批量删除
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBatchDialogOpen(true)}
              >
                <Layers className="size-4" />
                批量修改分类
              </Button>
            </div>
          </div>
        </div>
      )}

      {dialogOpen && (
        <ArtworkFormDialog artwork={editingArtwork} onClose={closeDialog} />
      )}

      {batchDialogOpen && (
        <AdminDialog
          title="批量修改分类"
          description={`将选中的 ${selectedIds.length} 件作品统一调整为新分类`}
          onClose={() => {
            setBatchDialogOpen(false);
            setBatchCategory(NO_CATEGORY);
          }}
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setBatchDialogOpen(false);
                  setBatchCategory(NO_CATEGORY);
                }}
              >
                取消
              </Button>
              <Button
                onClick={handleBatchUpdate}
                disabled={!batchCategory || batchUpdateMutation.isPending}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-700"
              >
                {batchUpdateMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                更新
              </Button>
            </>
          }
        >
          <div className="space-y-2">
            <Label htmlFor="batch-category">新分类</Label>
            <select
              id="batch-category"
              value={batchCategory}
              onChange={(event) => setBatchCategory(event.target.value)}
              className="h-9 w-full min-w-0 rounded-md border border-input bg-background px-2.5 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            >
              <option value={NO_CATEGORY}>请选择分类</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </AdminDialog>
      )}
    </div>
  );
}
