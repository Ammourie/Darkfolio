import React from 'react';

/** Ambient mesh + vignette behind the bento portfolio. */
export function BackgroundDecorations() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,hsl(var(--primary)/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-grid-soft opacity-[0.15]" />
      <div className="grain-overlay" />
    </div>
  );
}
