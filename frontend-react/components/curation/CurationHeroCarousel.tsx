"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { Artwork } from "@/types";

const AUTOPLAY_MS = 7000;

const EXHIBITION_FRAMES = [
  {
    tag: "本期主打",
    title: "虚实无界：光影与几何的静默交响",
    subtitle: "探寻现代极简主义的深度策展",
    description:
      "本期特别展览汇集馆内探索光线折射、几何结构与精神沉思的前沿作品，通过多维材质的相互映照，重建观者与空间之间的沉浸式对谈。",
  },
  {
    tag: "焦点特展",
    title: "色彩秩序：数字时代的物质重构",
    subtitle: "新锐数字与传统媒介联动展",
    description:
      "当数字信号的精确定位碰撞传统颜料的偶然扩散，艺术创作在算法与灵感之间衍生出全新的秩序范式。",
  },
  {
    tag: "学术推荐",
    title: "寂静之境：形与意的当代对话",
    subtitle: "空间形态学的先锋实践",
    description:
      "通过剔除冗余形态，作品不再仅仅作为被观测的客体，而成为重塑展厅光影与气流的无形构件。",
  },
];

export function CurationHeroCarousel({ artworks }: { artworks: Artwork[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const remainingRef = useRef(AUTOPLAY_MS);
  const slides = Math.min(3, artworks.length);

  // 切屏后重置自动播放计时
  useEffect(() => {
    remainingRef.current = AUTOPLAY_MS;
  }, [currentSlide]);

  // 暂停时保留剩余时长，恢复后从剩余处继续
  useEffect(() => {
    if (slides <= 1 || isPaused) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => {
      setCurrentSlide((currentSlide) => (currentSlide + 1) % slides);
    }, remainingRef.current);
    return () => {
      clearTimeout(timer);
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startedAt),
      );
    };
  }, [currentSlide, slides, isPaused]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }
      if (event.key === "ArrowLeft") {
        setCurrentSlide((currentSlide) => (currentSlide - 1 + slides) % slides);
      } else if (event.key === "ArrowRight") {
        setCurrentSlide((currentSlide) => (currentSlide + 1) % slides);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slides]);

  if (slides === 0) return null;

  const frame = EXHIBITION_FRAMES[currentSlide % EXHIBITION_FRAMES.length];
  const artwork = artworks[currentSlide];

  return (
    <section
      className="group relative overflow-hidden rounded-3xl border border-border shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative flex min-h-[420px] items-end md:min-h-[620px]">
        {artworks.slice(0, slides).map((item, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
                isActive
                  ? "z-10 opacity-100"
                  : "pointer-events-none z-0 opacity-0"
              }`}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                priority={index === 0}
                sizes="(min-width: 1280px) 72rem, 100vw"
                className={`animate-kenburns object-cover ${
                  isActive
                    ? "[animation-play-state:running] group-hover:[animation-play-state:paused]"
                    : "[animation-play-state:paused]"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0f0f11] via-[#0f0f11]/20 to-transparent" />
            </div>
          );
        })}

        <div className="absolute right-6 top-6 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 font-mono text-xs backdrop-blur-md">
          <span
            key={currentSlide}
            className="animate-fade-up inline-block min-w-4 text-center text-amber-300"
          >
            {String(currentSlide + 1).padStart(2, "0")}
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/70">
            {String(slides).padStart(2, "0")}
          </span>
        </div>

        <div
          key={currentSlide}
          className="relative z-20 max-w-3xl space-y-4 p-6 md:p-12"
        >
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-1 font-mono text-xs tracking-wider text-amber-300 backdrop-blur-sm">
            <Sparkles className="size-3" />
            {frame.tag}
          </div>
          <h1 className="animate-fade-up font-serif text-3xl leading-tight tracking-tight text-white [animation-delay:120ms] md:text-5xl">
            {frame.title}
          </h1>
          <p className="animate-fade-up font-mono text-sm tracking-wide text-amber-200/90 [animation-delay:240ms] md:text-base">
            {frame.subtitle}
          </p>
          <p className="animate-fade-up max-w-2xl text-xs leading-relaxed text-zinc-300/80 [animation-delay:360ms] md:text-sm">
            {frame.description}
          </p>
          <div className="animate-fade-up flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 font-mono text-xs text-zinc-400 [animation-delay:480ms]">
            <span>策展人：AETHERIA 编辑部</span>
            <span>•</span>
            <span>
              本期展品：《{artwork.title}》{artwork.artist}
            </span>
          </div>
          <div className="animate-fade-up flex items-center gap-4 pt-3 [animation-delay:600ms]">
            <Link
              href={`/artworks/${artwork.id}`}
              className="group/btn flex w-fit items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-xs font-medium uppercase tracking-widest text-zinc-950 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-400/30 md:text-sm"
            >
              探索展览作品
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
          <div className="mr-4 flex items-center gap-1.5">
            {Array.from({ length: slides }).map((_, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`切换到第 ${index + 1} 个展览`}
                  aria-current={isActive ? "true" : undefined}
                  className="group/dot flex h-4 items-center"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-500 ${
                      isActive
                        ? "w-5 bg-amber-400"
                        : "w-1.5 bg-white/40 group-hover/dot:w-3 group-hover/dot:bg-white/70"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() =>
              setCurrentSlide(
                (currentSlide) => (currentSlide - 1 + slides) % slides,
              )
            }
            aria-label="上一个展览"
            className="rounded-full border border-white/20 bg-black/40 p-2.5 text-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-amber-400/50 hover:bg-black/60 hover:text-amber-300 active:scale-95"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrentSlide((currentSlide) => (currentSlide + 1) % slides)
            }
            aria-label="下一个展览"
            className="rounded-full border border-white/20 bg-black/40 p-2.5 text-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-amber-400/50 hover:bg-black/60 hover:text-amber-300 active:scale-95"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
