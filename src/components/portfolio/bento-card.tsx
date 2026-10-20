import { cn } from '@/lib/utils';
import React from 'react';

type BentoCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Tailwind col-span / row-span classes for the bento grid */
  span?: string;
  glow?: boolean;
};

/** Glass bento cell used across the portfolio grid. */
export function BentoCard({ className, span, glow, children, ...props }: BentoCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/50 backdrop-blur-md',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]',
        glow && 'before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/10 before:to-transparent',
        span,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
