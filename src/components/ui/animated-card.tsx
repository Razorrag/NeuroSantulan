'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'glass-dark' | 'surface';
  hover?: boolean;
}

export function AnimatedCard({ 
  children, 
  className, 
  variant = 'glass-dark',
  hover = true,
  ...props 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        y: -6, 
        scale: 1.01,
        transition: { duration: 0.2 }
      } : undefined}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        variant === 'glass' && 'glass',
        variant === 'glass-dark' && 'glass-dark',
        variant === 'surface' && 'surface-card',
        'rounded-[1.8rem] p-6',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({ 
  children, 
  className,
  index = 0,
  ...props 
}: HTMLMotionProps<'div'> & { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={cn('rounded-xl p-4', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
