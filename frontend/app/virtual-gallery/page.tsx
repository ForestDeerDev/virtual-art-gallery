"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const VirtualGalleryScene = dynamic(
  () => import("@/components/virtual-gallery/VirtualGalleryScene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 bg-[#2a2a3e]">
        <Loader2 className="size-10 animate-spin text-amber-400" />
        <p className="text-white/70">正在进入虚拟画廊...</p>
      </div>
    ),
  },
);

export default function VirtualGalleryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <VirtualGalleryScene />
      </main>
    </div>
  );
}
