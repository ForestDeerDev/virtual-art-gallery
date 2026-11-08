"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 6000,
          style: {
            maxWidth: "200px",
            padding: "8px 12px",
            fontSize: "13px",
            lineHeight: "1.5",
          },
        }}
      />
    </QueryClientProvider>
  );
}
