'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import React from 'react';

type AnimatedSectionProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  delay?: number;
  /** First paint visible; avoids blank page before intersection observer runs */
  initialVisible?: boolean;
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  initialVisible = false,
  ...props
}: AnimatedSectionProps) {
  const [reduceMotion, setReduceMotion] = useState(initialVisible);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.08,
    initialInView: initialVisible,
  });

  const visible = reduceMotion || inView;

  return (
    <section
      {...props}
      ref={ref}
      className={cn(
        'scroll-mt-24 md:scroll-mt-32',
        'motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out',
        visible ? 'opacity-100 translate-y-0' : 'motion-safe:translate-y-6 opacity-0',
        className
      )}
      style={{ transitionDelay: reduceMotion ? '0ms' : `${delay}ms`, ...props.style }}
    >
      {children}
    </section>
  );
}
