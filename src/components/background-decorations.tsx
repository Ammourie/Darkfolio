import React from 'react';

type CodeGlyph = {
  text: string;
  className: string;
  rotate: string;
  delay?: string;
};

const FIELD_SYMBOLS = ['{', '}', '</>', '=>', '()', '[]', ';;', '#', '0x', 'async', 'Widget', 'main()'];

/** Large accent glyphs at viewport edges. */
const CODE_GLYPHS: CodeGlyph[] = [
  { text: '{', className: 'top-[6%] start-[2%] text-6xl', rotate: '-12deg', delay: '0s' },
  { text: '}', className: 'top-[20%] start-[8%] text-4xl', rotate: '10deg', delay: '2s' },
  { text: '</>', className: 'top-[42%] start-[1%] text-3xl', rotate: '-8deg', delay: '4s' },
  { text: '=>', className: 'bottom-[30%] start-[6%] text-4xl', rotate: '6deg', delay: '1s' },
  { text: '();', className: 'bottom-[10%] start-[3%] text-5xl', rotate: '-14deg', delay: '3s' },
  { text: '}', className: 'top-[8%] end-[3%] text-5xl', rotate: '14deg', delay: '1.5s' },
  { text: '{', className: 'top-[26%] end-[9%] text-4xl', rotate: '-6deg', delay: '3.5s' },
  { text: 'async', className: 'top-[50%] end-[2%] text-2xl', rotate: '-4deg', delay: '0.5s' },
  { text: '[]', className: 'bottom-[36%] end-[5%] text-4xl', rotate: '8deg', delay: '2.5s' },
  { text: '#', className: 'bottom-[14%] end-[10%] text-6xl', rotate: '-10deg', delay: '4.5s' },
  { text: '/*', className: 'top-[34%] end-[14%] text-3xl', rotate: '4deg', delay: '2s' },
  { text: '*/', className: 'top-[68%] end-[12%] text-3xl', rotate: '-6deg', delay: '4s' },
  { text: 'Flutter', className: 'top-[14%] start-[18%] hidden text-xl md:block', rotate: '5deg', delay: '5s' },
  { text: 'build()', className: 'bottom-[44%] start-[14%] hidden text-lg md:block', rotate: '-2deg', delay: '5.5s' },
];

/** Ambient mesh, grid, and code glyphs behind the bento portfolio. */
export function BackgroundDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,hsl(var(--primary)/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_0%_80%,hsl(var(--primary)/0.06),transparent_45%)]" />
      <div className="absolute inset-0 bg-grid-soft opacity-[0.18]" />

      {/* Tiled symbol field — visible in side gutters and above/below content */}
      <div className="code-symbol-field absolute inset-0">
        {Array.from({ length: 48 }).map((_, i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          const symbol = FIELD_SYMBOLS[i % FIELD_SYMBOLS.length];
          return (
            <span
              key={`field-${i}`}
              className="code-glyph-static flex items-center justify-center font-mono text-sm font-medium text-primary/25 md:text-base"
              style={{
                gridColumn: col + 1,
                gridRow: row + 1,
                transform: `rotate(${(i % 5) * 4 - 8}deg)`,
              }}
            >
              {symbol}
            </span>
          );
        })}
      </div>

      {/* Accent glyphs — stronger at edges */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_85%_75%_at_50%_45%,transparent_20%,#000_92%)]">
        {CODE_GLYPHS.map((glyph) => (
          <span
            key={`${glyph.text}-${glyph.className}`}
            className={`code-glyph absolute font-mono font-semibold tracking-tight text-primary/35 select-none ${glyph.className}`}
            style={
              {
                '--glyph-rotate': glyph.rotate,
                animationDelay: glyph.delay,
                textShadow: '0 0 40px hsl(var(--primary) / 0.15)',
              } as React.CSSProperties
            }
          >
            {glyph.text}
          </span>
        ))}
      </div>

      <div className="grain-overlay opacity-[0.035]" />
    </div>
  );
}
