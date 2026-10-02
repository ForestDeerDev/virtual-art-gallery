"use client";

import { useEffect, useState } from "react";
import type { SVGProps } from "react";
import Link from "next/link";
import { Stone, Mail, X, ArrowUp, Rose, type LucideIcon } from "lucide-react";

const GithubIcon = ((props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)) as LucideIcon;

const socialLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "#", label: "GitHub", icon: GithubIcon },
  { href: "#", label: "X", icon: X },
  { href: "#", label: "邮箱", icon: Mail },
];

interface FooterLink {
  href: string;
  label: string;
}

interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "画廊链接",
    links: [
      { href: "/gallery", label: "全集目录" },
      { href: "#", label: "艺术家" },
      { href: "#", label: "艺术风格" },
      { href: "#", label: "特别展览" },
    ],
  },
  {
    title: "关于我们",
    links: [
      { href: "#", label: "关于画廊" },
      { href: "#", label: "团队成员" },
      { href: "#", label: "加入我们" },
      { href: "#", label: "联系合作" },
    ],
  },
];

export function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-[#101844]">
      {/* 顶部微弱极光渐变带 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-cyan-500/15 via-purple-500/8 to-transparent" />
      {/* 右下暖色微光 */}
      <div className="pointer-events-none absolute -bottom-16 right-0 -z-10 size-72 rounded-full bg-pink-400/10 blur-3xl" />
      {/* 装饰星点光晕 */}
      <div className="pointer-events-none absolute left-[10%] top-[25%] -z-10 size-6 rounded-full bg-cyan-300/20 blur-md" />
      <div className="pointer-events-none absolute right-[18%] top-[35%] -z-10 size-4 rounded-full bg-white/20 blur-sm" />
      <div className="pointer-events-none absolute left-[55%] bottom-[25%] -z-10 size-3 rounded-full bg-cyan-200/30 blur-sm" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
          {/* 品牌区 */}
          <div>
            <Link href="/home" className="flex items-center gap-2">
              <Stone className="size-12 text-cyan-300" />
              <span className="bg-gradient-to-r from-cyan-200 via-pink-300 to-amber-200 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                虚拟艺术画廊
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-base leading-relaxed text-white/70">
              探索数字艺术的无限可能，发现来自世界各地的精美艺术作品。
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-11 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* 链接列 */}
          <div className="grid grid-cols-2 gap-8">
            {footerLinkGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101844]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="relative md:pl-3 md:-translate-x-5">
            <p className="mt-12 font-serif text-lg font-medium italic leading-relaxed text-white/85">
              在每一束光里，都藏着一幅未完成的画
            </p>
            <p className="mt-3 font-serif text-sm italic text-white/40">
              —— 而故事，还没有结束
            </p>

            <div
              className="pointer-events-none absolute -right-6 -top-3 hidden lg:block"
              aria-hidden
            >
              <div className="absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
              <Rose
                className="relative size-44 -rotate-12 text-cyan-200/15"
                strokeWidth={0.75}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 border-t border-white/10 pt-6">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} 虚拟艺术画廊 · 保留所有权利
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="回到顶部"
        className={`fixed bottom-6 right-6 z-50 flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white transition-all duration-300 ${
          showTop
            ? "shadow-lg shadow-cyan-500/30 hover:scale-110"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="size-5" />
      </button>
    </footer>
  );
}
