"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  LogIn,
  UserPlus,
  Upload,
  Home,
  Image as ImageIcon,
  Sparkles,
  Menu,
  X,
  Leaf,
  Stone,
  type LucideIcon,
} from "lucide-react";
import type { User } from "@/types";
import { useAuthStore } from "@/stores/auth";
import {
  useIsAuthenticated,
  useIsAdmin,
  useCurrentUser,
} from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

function UserAvatar({
  user,
  className,
}: {
  user?: User | null;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const avatar = user?.avatar;
  if (avatar && failedSrc !== avatar) {
    return (
      <Image
        src={avatar}
        alt={user.username}
        width={64}
        height={64}
        unoptimized
        onError={() => setFailedSrc(avatar)}
        className={cn(
          "rounded-full object-cover ring-2 ring-indigo-500/30",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white ring-2 ring-indigo-500/30",
        className,
      )}
    >
      {user?.username?.charAt(0).toUpperCase()}
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const userInfo = useCurrentUser();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const navItems: NavItem[] = [
    { href: "/home", label: "首页", icon: Home },
    { href: "/gallery", label: "画廊", icon: ImageIcon },
    ...(isLoggedIn
      ? [
          { href: "/recommendations", label: "推荐", icon: Sparkles },
          { href: "/upload", label: "上传作品", icon: Upload },
        ]
      : []),
    ...(isAdmin ? [{ href: "/admin", label: "管理", icon: Leaf }] : []),
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const isHeroHeader =
    !scrolled && !mobileOpen && (pathname === "/home" || pathname === "/");

  const heroHeaderStyle = isHeroHeader
    ? {
        backgroundImage:
          "linear-gradient(to bottom, rgba(16,24,68,0.78), rgba(16,24,68,0.35)), url('/home-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  const handleLogout = () => {
    clearAuth();
    setMobileOpen(false);
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300",
        isHeroHeader
          ? "border-transparent"
          : scrolled || mobileOpen
            ? "border-border/60 bg-background/90 shadow-sm"
            : "border-border/30 bg-background/70",
      )}
      style={heroHeaderStyle}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/home" className="group flex shrink-0 items-center gap-2">
          <Stone
            className={cn(
              "size-8",
              isHeroHeader ? "text-white" : "text-blue-500",
            )}
          />
          <span
            className={cn(
              "text-lg font-bold tracking-tight",
              isHeroHeader
                ? "bg-gradient-to-r from-cyan-200 via-pink-300 to-amber-200 bg-clip-text text-transparent"
                : "text-blue-500",
            )}
          >
            虚拟艺术画廊
          </span>
        </Link>

        {/* 桌面端导航 */}
        <div className="ml-10 hidden items-center gap-1 lg:flex">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-1.5 overflow-hidden rounded-full px-3.5 py-1.5 text-base transition-colors duration-200",
                  "after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-2/3 after:-translate-x-1/2 after:scale-x-0 after:rounded-full after:bg-[radial-gradient(ellipse_at_center,rgb(129,140,248)_0%,rgb(168,85,247)_45%,rgba(168,85,247,0)_78%)] after:transition-transform after:duration-300",
                  isHeroHeader
                    ? active
                      ? "bg-white/20 font-medium text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white hover:after:scale-x-100"
                    : active
                      ? "bg-indigo-500/10 font-medium text-indigo-600"
                      : "text-muted-foreground hover:bg-indigo-500/5 hover:text-indigo-600 hover:after:scale-x-100",
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* 桌面端用户区 */}
        {isLoggedIn ? (
          <div className="ml-auto hidden items-center gap-1.5 lg:flex">
            <Link
              href="/profile"
              title="个人中心"
              className={cn(
                "flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors",
                isHeroHeader ? "hover:bg-white/10" : "hover:bg-indigo-500/5",
              )}
            >
              <UserAvatar
                user={userInfo}
                className="size-8 transition-transform hover:scale-105"
              />
              <span
                className={cn(
                  "hidden max-w-[120px] truncate text-sm font-medium lg:block",
                  isHeroHeader ? "text-white" : "text-foreground",
                )}
              >
                {userInfo?.username}
              </span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              title="退出登录"
              aria-label="退出登录"
              className={cn(
                "flex size-9 items-center justify-center rounded-full transition-colors",
                isHeroHeader
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
              )}
            >
              <LogOut className="size-5" />
            </button>
          </div>
        ) : (
          <div className="ml-auto hidden items-center gap-1 lg:flex">
            <Link
              href="/login"
              className={cn(
                "relative flex items-center gap-1.5 overflow-hidden rounded-full px-3.5 py-1.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-2/3 after:-translate-x-1/2 after:scale-x-0 after:rounded-full after:bg-[radial-gradient(ellipse_at_center,rgb(129,140,248)_0%,rgb(168,85,247)_45%,rgba(168,85,247,0)_78%)] after:transition-transform after:duration-300",
                isHeroHeader
                  ? "text-white/80 hover:bg-white/10 hover:text-white hover:after:scale-x-100"
                  : "text-muted-foreground hover:bg-indigo-500/5 hover:text-indigo-600 hover:after:scale-x-100",
              )}
            >
              <LogIn className="size-5" />
              登录
            </Link>
            <Link
              href="/register"
              className={cn(
                "relative flex items-center gap-1.5 overflow-hidden rounded-full px-3.5 py-1.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-2/3 after:-translate-x-1/2 after:scale-x-0 after:rounded-full after:bg-[radial-gradient(ellipse_at_center,rgb(129,140,248)_0%,rgb(168,85,247)_45%,rgba(168,85,247,0)_78%)] after:transition-transform after:duration-300",
                isHeroHeader
                  ? "text-white/80 hover:bg-white/10 hover:text-white hover:after:scale-x-100"
                  : "text-muted-foreground hover:bg-indigo-500/5 hover:text-indigo-600 hover:after:scale-x-100",
              )}
            >
              <UserPlus className="size-5" />
              注册
            </Link>
          </div>
        )}

        {/* 移动端用户区 + 菜单按钮 */}
        <div className="flex items-center gap-1.5 lg:hidden">
          {isLoggedIn && (
            <Link
              href="/profile"
              aria-label="个人中心"
              className="rounded-full transition-transform hover:scale-105"
            >
              <UserAvatar user={userInfo} className="size-8" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-colors",
              isHeroHeader
                ? "text-white/80 hover:bg-white/10 hover:text-white"
                : "text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-600",
            )}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </nav>

      {/* 移动端下拉菜单 */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border/50 bg-background/95 backdrop-blur-md lg:hidden"
        >
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-base transition-colors",
                    active
                      ? "bg-indigo-500/10 font-medium text-indigo-600"
                      : "text-muted-foreground hover:bg-indigo-500/5 hover:text-indigo-600",
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {label}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-border/60 pt-3">
              {isLoggedIn ? (
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-indigo-500/5"
                  >
                    <UserAvatar user={userInfo} className="size-9" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {userInfo?.username}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {userInfo?.email}
                      </span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-base text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="size-5 shrink-0" />
                    退出登录
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-indigo-500/5 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <LogIn className="size-5" />
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-indigo-500/5 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <UserPlus className="size-5" />
                    注册
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
