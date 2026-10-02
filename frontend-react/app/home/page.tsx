"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brush,
  Camera,
  Monitor,
  Box,
  Palette as PaletteIcon,
  Edit,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArtworkCard } from "@/components/ArtworkCard";
import {
  useFeaturedArtworks,
  useCategoryStats,
  useCategoryThumbnails,
} from "@/hooks/useArtworks";
import type { Artwork } from "@/types";

const CATEGORY_ICONS: Record<string, typeof Brush> = {
  油画: Brush,
  水彩: ImageIcon,
  素描: Edit,
  雕塑: Box,
  摄影: Camera,
  数字艺术: Monitor,
};

const FEATURES = [
  { icon: Box, title: "沉浸式展厅", desc: "3D 空间漫游观展" },
  { icon: PaletteIcon, title: "多元分类", desc: "油画、水彩、雕塑等" },
  { icon: Camera, title: "高清欣赏", desc: "放大品味每处笔触" },
];

const HERO_CARD_STYLES: {
  width: number;
  height: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate: number;
  zIndex: number;
}[] = [
  {
    width: 280,
    height: 380,
    top: "5%",
    left: "-5%",
    rotate: -5,
    zIndex: 3,
  },
  {
    width: 240,
    height: 320,
    bottom: "10%",
    left: "50%",
    rotate: 3,
    zIndex: 2,
  },
  {
    width: 200,
    height: 280,
    top: "15%",
    right: "-30%",
    rotate: -3,
    zIndex: 1,
  },
];

const DAY_SEED = Math.floor(Date.now() / 86_400_000);

export default function HomePage() {
  const { data: featured, isLoading: featuredLoading } =
    useFeaturedArtworks(12);
  const { data: categories, isLoading: categoriesLoading } = useCategoryStats();
  const { data: allArtworks } = useCategoryThumbnails();

  const thumbnailsByCategory = useMemo(() => {
    const map: Record<string, Artwork[]> = {};
    for (const artwork of allArtworks ?? []) {
      (map[artwork.category] ??= []).push(artwork);
    }
    return map;
  }, [allArtworks]);

  const heroArtworks = useMemo(() => {
    if (!featured?.length) return [];
    const n = Math.min(3, featured.length);
    return Array.from(
      { length: n },
      (_, i) => featured[(DAY_SEED + i) % featured.length],
    );
  }, [featured]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Background wrapper: Hero + Featured Artworks header */}
        <div className="relative isolate overflow-hidden">
          {/* Base background fallback */}
          <div className="absolute inset-0 -z-20 bg-[#101844]" />

          {/* Background image */}
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/home-bg.png')" }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101844]/60 via-[#101844]/25 to-transparent" />

          {/* Hero Section */}
          <section className="relative py-20 text-white">
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                {/* Hero Content */}
                <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                  <span className="inline-block rounded-full border border-white/10 bg-white/10 px-4 py-1 text-sm font-semibold backdrop-blur-md">
                    艺术无界，创意无限
                  </span>

                  <h1 className="mt-4 font-serif text-4xl font-extrabold leading-tight tracking-wide sm:text-5xl">
                    欢迎来到
                    <span className="bg-gradient-to-r from-cyan-200 via-pink-300 to-amber-200 bg-clip-text text-transparent">
                      {" "}
                      虚拟艺术画廊
                    </span>
                  </h1>

                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
                    探索数字艺术的无限可能，发现来自世界各地的精美艺术作品。
                    在这里，每一件作品都讲述着独特的故事，等待您的发现。
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Button
                      render={<Link href="/gallery" />}
                      nativeButton={false}
                      size="lg"
                      className="gap-2.5 bg-white px-7 text-slate-900 shadow-lg shadow-black/20 hover:bg-white/95 hover:shadow-xl hover:shadow-indigo-500/30"
                    >
                      开始探索
                      <ArrowRight className="size-5 transition-transform duration-300 group-hover/button:translate-x-1" />
                    </Button>

                    <Button
                      render={<Link href="/virtual-gallery" />}
                      nativeButton={false}
                      size="lg"
                      variant="outline"
                      className="relative overflow-hidden border-2 border-cyan-400/80 bg-gradient-to-b from-slate-900/40 via-cyan-950/30 to-slate-900/60 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.4),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(34,211,238,0.6)] backdrop-blur-md transition-all duration-300 hover:border-cyan-300 hover:text-cyan-100 hover:shadow-[0_0_22px_rgba(34,211,238,0.7),inset_0_1px_2px_rgba(255,255,255,0.6)]"
                    >
                      {/* 按钮文字 */}
                      <span className="relative z-10 font-medium tracking-wider drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-300 group-hover/button:drop-shadow-[0_0_14px_rgba(34,211,238,0.95)]">
                        进入虚拟画廊
                      </span>
                    </Button>
                  </div>

                  <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
                    {FEATURES.map(({ icon: Icon, title, desc }) => (
                      <div key={title} className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 backdrop-blur-md">
                          <Icon className="size-5 text-cyan-200" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{title}</div>
                          <div className="text-xs text-white/60">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hero Artwork Showcase */}
                <div className="relative hidden h-[500px] lg:block">
                  {heroArtworks.map((artwork, i) => {
                    const style = HERO_CARD_STYLES[i];
                    return (
                      <div
                        key={artwork.id}
                        className="absolute overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/30 transition-all duration-300 hover:scale-105"
                        style={{
                          width: style.width,
                          height: style.height,
                          top: style.top,
                          bottom: style.bottom,
                          left: style.left,
                          right: style.right,
                          zIndex: style.zIndex,
                          transform: `rotate(${style.rotate}deg)`,
                        }}
                      >
                        <Image
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          fill
                          sizes="280px"
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Featured Artworks header */}
          <section className="relative py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="font-serif text-3xl font-extrabold tracking-wide text-white sm:text-4xl">
                  精选作品
                </h2>
                <div className="relative mx-auto mt-5 h-[2px] w-40">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                </div>
                <p className="mx-auto mt-4 max-w-2xl text-white/70">
                  我们精心挑选了一些最具代表性的艺术作品，展示来自世界各地艺术家的创作才华和独特视角。
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Featured Artworks cards */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {featuredLoading ? (
              <div className="flex flex-col items-center gap-3 py-16">
                <Loader2 className="size-10 animate-spin text-indigo-500" />
                <p className="text-muted-foreground">加载中...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {featured?.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="pt-3 pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-extrabold tracking-wide text-foreground sm:text-4xl">
                艺术分类
              </h2>
              <div className="relative mx-auto mt-5 h-[2px] w-40">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
              </div>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                探索不同类型的艺术作品，找到您喜欢的风格和主题。
              </p>
            </div>

            {categoriesLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="size-10 animate-spin text-indigo-500" />
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap justify-center gap-6">
                {categories?.map((category) => {
                  const Icon = CATEGORY_ICONS[category.category] ?? PaletteIcon;
                  const [first, ...rest] =
                    thumbnailsByCategory[category.category] ?? [];
                  const smalls = rest.slice(0, 4);
                  const smallGridClass =
                    smalls.length >= 3
                      ? "grid-cols-2 grid-rows-2"
                      : smalls.length === 2
                        ? "grid-rows-2"
                        : "grid-rows-1";
                  return (
                    <Link
                      key={category.category}
                      href={`/gallery?category=${encodeURIComponent(category.category)}`}
                      className="group relative block w-full overflow-hidden rounded-2xl border border-stone-500/50 bg-stone-600 p-3 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300/60 hover:shadow-xl hover:shadow-indigo-500/20 sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                    >
                      {first && (
                        <Image
                          src={first.imageUrl}
                          alt=""
                          aria-hidden
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="scale-125 object-cover opacity-20 blur-2xl transition-all duration-500 group-hover:scale-[1.4] group-hover:opacity-30"
                        />
                      )}
                      <div className="relative h-44 overflow-hidden rounded-xl bg-stone-700">
                        {first ? (
                          rest.length > 0 ? (
                            <div className="flex h-full gap-2 p-2">
                              <div className="relative w-[55%] overflow-hidden rounded-lg">
                                <Image
                                  src={first.imageUrl}
                                  alt={first.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <div
                                className={`grid flex-1 gap-2 ${smallGridClass}`}
                              >
                                {smalls.map((artwork, i) => (
                                  <div
                                    key={artwork.id}
                                    className={`relative overflow-hidden rounded-lg ${
                                      smalls.length === 3 && i === 0
                                        ? "col-span-2"
                                        : ""
                                    }`}
                                  >
                                    <Image
                                      src={artwork.imageUrl}
                                      alt={artwork.title}
                                      fill
                                      sizes="150px"
                                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Image
                              src={first.imageUrl}
                              alt={first.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Icon className="size-12 text-stone-500" />
                          </div>
                        )}
                      </div>
                      <div className="relative flex items-center gap-3 px-2 py-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-stone-200">
                          <Icon className="size-5 text-stone-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {category.category}
                          </h3>
                          <p className="text-xs text-stone-300">
                            {category.count} 件作品
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
