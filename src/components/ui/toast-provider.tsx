'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: 'glass-dark rounded-[1.2rem] border-0 shadow-lg min-w-[320px]',
          success: 'bg-emerald-400/10 text-emerald-900',
          error: 'bg-rose-400/10 text-rose-900',
          loading: 'bg-slate-400/10 text-slate-900',
          info: 'bg-sky-400/10 text-sky-900',
          title: 'text-sm font-medium',
          description: 'text-xs mt-1 opacity-80',
          closeButton: 'hover:bg-white/20',
        },
      }}
      richColors
      visibleToasts={5}
    />
  );
}

// Re-export toast for easy importing
export { toast } from 'sonner';
