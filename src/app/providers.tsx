'use client';

import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ToastProvider } from '@/components/ui/toast-provider';
import { Background } from '@/components/ui/background';
import { AuthProvider } from '@/lib/auth-context';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [bgDisabled] = useState(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Background disabled={bgDisabled}>
          {children}
          <ToastProvider />
        </Background>
      </AuthProvider>
    </ErrorBoundary>
  );
}
