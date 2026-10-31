"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/artworks", label: "作品管理", icon: ImageIcon },
  { href: "/admin/users", label: "用户管理", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Navbar />
      <main className="flex-1">
        <RequireAuth requireAdmin>
          <div className="mx-auto max-w-page px-4 py-6 sm:px-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              <aside className="lg:w-56 lg:shrink-0">
                <Card className="lg:sticky lg:top-20">
                  <CardContent className="gap-1 p-2">
                    <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      管理菜单
                    </p>
                    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
                      {ADMIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                        const active =
                          href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(href);
                        return (
                          <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                              active
                                ? "bg-gradient-to-r from-indigo-500/15 to-purple-500/10 font-medium text-indigo-600 dark:text-indigo-400"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            <Icon className="size-4 shrink-0" />
                            {label}
                          </Link>
                        );
                      })}
                    </nav>
                  </CardContent>
                </Card>
              </aside>

              <div className="min-w-0 flex-1">{children}</div>
            </div>
          </div>
        </RequireAuth>
      </main>
    </div>
  );
}
