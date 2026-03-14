'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'avatar';
}

export function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  const baseClasses = 'bg-slate-200/60';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'h-12 w-12 rounded-full',
    avatar: 'h-20 w-20 rounded-3xl',
    rectangular: 'h-32 rounded-xl',
    card: 'rounded-[1.8rem] p-6 space-y-4',
  };

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-dark rounded-[1.8rem] p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function AppointmentSkeleton() {
  return (
    <div className="surface-card rounded-[1.4rem] p-4 sm:p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton variant="circular" className="h-8 w-24 rounded-full" />
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-dark rounded-[1.6rem] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
