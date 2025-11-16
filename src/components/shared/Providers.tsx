'use client';

import React from 'react'; // Changed from "import type React from 'react';"
import { AuthProvider } from '@/hooks/use-auth-store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
