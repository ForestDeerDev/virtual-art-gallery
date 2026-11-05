"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Artwork } from "@/types";

const EDITORIAL_THEMES = [
  {
    title: "光影与寂静：极简主义的现代回响",
    tag: "深度策展特稿",
    intro:
      "从特定对象到色彩场域，极简主义如何重新定义了我们对于“空无”与“存在”的认知方式？",
  },
  {
    title: "数字时代的色彩秩序与精神宿主",
    tag: "媒介批判",
    intro:
      "当屏幕成为获取视觉刺激的主通道，传统颜料的物理实在感正迎来前所未有的精神反弹。",
  },
  {
    title: "有机形态：雕塑的另一种生命维度",
    tag: "雕塑专栏",
    intro:
      "新一代雕塑家抛弃硬朗线条，转而寻求曲线、孔洞与自然腐蚀肌理背后的生命本源动力。",
  },
];

const MAX_CARDS = 3;

export function EditorialSection({ artworks }: { artworks: Artwork[] }) {
  if (artworks.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-amber-600">
            CURATORIAL JOURNAL
          </span>
          <h2 className="font-serif text-2xl font-normal text-foreground md:text-3xl">
            策展叙事与深度研究
          </h2>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-amber-600"
        >
          阅读全部专栏 <ArrowUpRight className="size-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {artworks.slice(0, MAX_CARDS).map((item, index) => {
          const theme = EDITORIAL_THEMES[index];
          if (!theme) {
            return null;
          }
          return (
          <article
            key={item.id}
            className="group animate-fade-up relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.22)]"
            style={{ animationDelay: `${index * 140}ms` }}
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative h-52 overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={theme.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute left-4 top-4 rounded-full border border-amber-300/30 bg-zinc-950/60 px-3 py-1 font-mono text-[10px] tracking-widest text-amber-200 backdrop-blur-md">
                {theme.tag}
              </div>
              <span className="absolute bottom-2.5 right-4 font-serif text-4xl italic leading-none text-white/30">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="w-fit font-serif text-lg leading-snug text-foreground transition-colors duration-300 group-hover:text-amber-600">
                {theme.title}
                <span className="mt-1 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-amber-600 to-amber-400 transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {theme.intro}
              </p>

              <div className="mt-auto flex justify-end pt-4">
                <span className="flex size-7 items-center justify-center rounded-full border border-amber-500/30 text-amber-600 transition-all duration-300 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-zinc-950">
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}
