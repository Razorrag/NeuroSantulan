'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface LoadingState {
  type: 'loading' | 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
}

interface EnhancedLoadingProps {
  state: LoadingState | null;
  children: React.ReactNode;
  className?: string;
}

export function EnhancedLoading({ state, children, className }: EnhancedLoadingProps) {
  if (!state) {
    return <div className={className}>{children}</div>;
  }

  const getIcon = () => {
    switch (state.type) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (state.type) {
      case 'loading':
        return 'text-orange-500';
      case 'success':
        return 'text-emerald-500';
      case 'error':
        return 'text-rose-500';
      case 'warning':
        return 'text-amber-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {state.type === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg z-10"
          >
            <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-lg border border-slate-200">
              <div className={getColors()}>
                {getIcon()}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {state.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={state.type === 'loading' ? 'opacity-50 pointer-events-none' : ''}>
        {children}
      </div>

      {/* Toast-style notification for non-loading states */}
      <AnimatePresence>
        {state.type !== 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-lg border-l-4 ${
              state.type === 'success' ? 'border-emerald-500' :
              state.type === 'error' ? 'border-rose-500' :
              state.type === 'warning' ? 'border-amber-500' : 'border-slate-500'
            }`}>
              <div className={getColors()}>
                {getIcon()}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {state.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ProgressIndicatorProps {
  progress: number; // 0 to 100
  label?: string;
  className?: string;
}

export function ProgressIndicator({ progress, label, className }: ProgressIndicatorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between text-sm text-slate-600">
          <span>{label}</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className={`h-2 rounded-full ${
            progress < 50 ? 'bg-amber-500' : progress < 80 ? 'bg-orange-500' : 'bg-emerald-500'
          }`}
        />
      </div>
    </div>
  );
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-start gap-4">
          <div className={`mt-1 p-2 rounded-full ${
            type === 'danger' ? 'bg-rose-100' :
            type === 'warning' ? 'bg-amber-100' : 'bg-sky-100'
          }`}>
            {type === 'danger' ? (
              <XCircle className="h-5 w-5 text-rose-600" />
            ) : type === 'warning' ? (
              <AlertCircle className="h-5 w-5 text-amber-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-sky-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{message}</p>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="secondary-button min-h-10 px-4"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`min-h-10 px-4 font-medium rounded-xl transition-colors ${
              type === 'danger'
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : type === 'warning'
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-sky-600 text-white hover:bg-sky-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

interface SkeletonLoaderProps {
  type?: 'text' | 'card' | 'list' | 'table';
  count?: number;
  className?: string;
}

export function SkeletonLoader({ type = 'text', count = 1, className }: SkeletonLoaderProps) {
  const getLoader = () => {
    switch (type) {
      case 'card':
        return (
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-4/6" />
          </div>
        );
      case 'list':
        return (
          <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-12 w-12 bg-slate-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'table':
        return (
          <div className="space-y-3">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 rounded animate-pulse" />
            ))}
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {getLoader()}
    </div>
  );
}