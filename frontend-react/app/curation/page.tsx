"use client";

import Link from "next/link";
import { Loader2, RefreshCw, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CurationHeroCarousel } from "@/components/curation/CurationHeroCarousel";
import { EditorialSection } from "@/components/curation/EditorialSection";
import { useCurationArtworks } from "@/hooks/useCuration";

function CurationPage() {
  const { artworks, isLoading, isError, refetch } = useCurationArtworks();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Loader2 className="size-10 animate-spin text-amber-600" />
            <p className="font-mono text-sm text-muted-foreground">
              正在筹备本期展览...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <ServerCrash className="size-12 text-muted-foreground/60" />
            <span className="font-serif text-2xl text-foreground">
              展览内容加载失败
            </span>
            <p className="font-mono text-xs text-muted-foreground">
              策展内容暂时不可用，请稍后重试。
            </p>
            <Button onClick={() => refetch()} className="gap-2">
              <RefreshCw className="size-4" />
              重新加载
            </Button>
          </div>
        ) : artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <span className="font-serif text-2xl text-foreground">
              本期展览尚在筹备中
            </span>
            <p className="font-mono text-xs text-muted-foreground">
              画廊暂无可展出的作品，请先前往上传页面添加作品。
            </p>
            <Button render={<Link href="/upload" />} nativeButton={false}>
              前往上传作品
            </Button>
          </div>
        ) : (
          <div className="mx-auto max-w-page space-y-8 px-6 py-2 pb-16">
            <CurationHeroCarousel artworks={artworks} />
            <EditorialSection artworks={artworks.slice(3, 6)} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function CurationRoute() {
  return <CurationPage />;
}
