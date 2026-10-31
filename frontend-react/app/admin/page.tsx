"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Heart,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminArtworks, useAdminStats } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

interface StatCardConfig {
  label: string;
  value: number;
  hint?: string;
  icon: LucideIcon;
  gradient: string;
}

type HotMetric = "views" | "likes";

const HOT_METRICS: { key: HotMetric; label: string }[] = [
  { key: "views", label: "浏览量" },
  { key: "likes", label: "点赞数" },
];

export default function AdminDashboardPage() {
  const statsQuery = useAdminStats();
  const topQuery = useAdminArtworks(100);
  const [hotMetric, setHotMetric] = useState<HotMetric>("views");

  const stats = statsQuery.data;
  const topArtworks = useMemo(() => {
    const list = topQuery.data?.data ?? [];
    return [...list]
      .sort((a, b) =>
        hotMetric === "views"
          ? b.viewCount - a.viewCount
          : b.likeCount - a.likeCount,
      )
      .slice(0, 8);
  }, [topQuery.data, hotMetric]);

  const handleRefresh = () => {
    statsQuery.refetch();
    topQuery.refetch();
  };

  if (statsQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Loader2 className="size-10 animate-spin text-indigo-500" />
        <p className="text-muted-foreground">加载数据中...</p>
      </div>
    );
  }

  if (statsQuery.isError || !stats) {
    return (
      <Card>
        <CardContent className="items-center gap-3 py-16 text-center">
          <p className="text-muted-foreground">
            数据加载失败，请稍后重试。
          </p>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="size-4" />
            重新加载
          </Button>
        </CardContent>
      </Card>
    );
  }

  const statCards: StatCardConfig[] = [
    {
      label: "总作品数",
      value: stats.totalArtworks,
      icon: ImageIcon,
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      label: "总用户数",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-sky-500 to-cyan-500",
    },
    {
      label: "总浏览量",
      value: stats.totalViews,
      icon: Eye,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "总点赞数",
      value: stats.totalLikes,
      icon: Heart,
      gradient: "from-rose-500 to-pink-600",
    },
  ];

  const categoryEntries = Object.entries(stats.categoryStats ?? {});
  const roleEntries = Object.entries(stats.roleStats ?? {});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">管理仪表盘</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, hint, icon: Icon, gradient }) => (
          <Card key={label} className="transition-shadow hover:shadow-md">
            <CardContent className="items-center gap-2 text-center">
              <div className="flex items-center justify-center">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm",
                    gradient,
                  )}
                >
                  <Icon className="size-5" />
                </span>
                {hint && (
                  <span className="text-xs text-muted-foreground">{hint}</span>
                )}
              </div>
              <p className="text-2xl font-semibold tracking-tight tabular-nums">
                {value.toLocaleString("zh-CN")}
              </p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>分类统计</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryEntries.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                暂无数据
              </p>
            ) : (
              <div className="flex flex-col">
                {categoryEntries.map(([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-0"
                  >
                    <span className="text-sm">{category}</span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs tabular-nums text-muted-foreground">
                      {count} 件
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>角色统计</CardTitle>
          </CardHeader>
          <CardContent>
            {roleEntries.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                暂无数据
              </p>
            ) : (
              <div className="flex flex-col">
                {roleEntries.map(([role, count]) => {
                  const isAdminRole = role === "ADMIN";
                  return (
                    <div
                      key={role}
                      className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-0"
                    >
                      <span className="text-sm">
                        {isAdminRole ? "管理员" : "普通用户"}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs tabular-nums",
                          isAdminRole
                            ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
                        )}
                      >
                        {count} 人
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>TOP 8</CardTitle>
          <CardAction className="flex items-center gap-1">
            <div className="flex items-center rounded-lg bg-muted p-0.5">
              {HOT_METRICS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setHotMetric(key)}
                  aria-pressed={hotMetric === key}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs transition-colors",
                    hotMetric === key
                      ? "bg-background font-medium text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="px-0">
          {topQuery.isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              加载中...
            </div>
          ) : topQuery.isError ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <p className="text-sm text-muted-foreground">
                热门作品加载失败，请稍后重试。
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => topQuery.refetch()}
              >
                <RefreshCw className="size-4" />
                重新加载
              </Button>
            </div>
          ) : topArtworks.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              暂无作品
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] table-fixed text-sm">
                <thead>
                  <tr className="border-y bg-muted/40 text-left text-xs text-muted-foreground">
                    <th className="w-[10%] px-6 py-2.5 font-medium">#</th>
                    <th className="w-[12%] px-3 py-2.5 font-medium">预览图</th>
                    <th className="w-[28%] px-3 py-2.5 font-medium">标题</th>
                    <th className="w-[14%] px-3 py-2.5 font-medium">分类</th>
                    <th className="w-[13%] px-3 py-2.5 text-left font-medium">
                      浏览
                    </th>
                    <th className="w-[13%] px-3 py-2.5 text-left font-medium">
                      点赞
                    </th>
                    <th className="w-20 px-6 py-2.5">
                      <span className="sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topArtworks.map((artwork, index) => (
                    <tr
                      key={artwork.id}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-6 py-3">
                        <span
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full text-xs font-medium tabular-nums",
                            index < 3
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {index + 1}
                        </span>
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
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/artworks/${artwork.id}`}
                            className="truncate font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            {artwork.title}
                          </Link>
                          {artwork.featured && (
                            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-xs text-amber-600 dark:text-amber-400">
                              <Star className="size-3" />
                              精选
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-600 dark:text-indigo-400">
                          {artwork.category}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "whitespace-nowrap px-3 py-3 text-left tabular-nums",
                          hotMetric === "views"
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {artwork.viewCount.toLocaleString("zh-CN")}
                      </td>
                      <td
                        className={cn(
                          "whitespace-nowrap px-3 py-3 text-left tabular-nums",
                          hotMetric === "likes"
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {artwork.likeCount.toLocaleString("zh-CN")}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground"
                          render={
                            <Link
                              href={`/artworks/${artwork.id}`}
                              aria-label={`查看作品「${artwork.title}」`}
                              title="查看作品"
                            />
                          }
                          nativeButton={false}
                        >
                          <Eye className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
