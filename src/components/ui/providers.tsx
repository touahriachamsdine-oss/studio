// This file is intentionally left blank. It has been renamed to providers.tsx in the ui folder.
"use client";

import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
