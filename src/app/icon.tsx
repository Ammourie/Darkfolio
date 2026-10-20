import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/** Favicon — MA monogram (PNG; Next metadata loader does not accept SVG). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0c0d10',
          borderRadius: 8,
          border: '1px solid rgba(61, 141, 212, 0.35)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: -0.5,
          color: '#5aa8de',
        }}
      >
        MA
      </div>
    ),
    { ...size }
  );
}
