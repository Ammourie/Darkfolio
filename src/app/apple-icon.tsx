import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Apple touch icon — MA monogram. */
export default function AppleIcon() {
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
          borderRadius: 40,
          border: '2px solid rgba(61, 141, 212, 0.35)',
          fontSize: 62,
          fontWeight: 700,
          letterSpacing: -2,
          color: '#5aa8de',
        }}
      >
        MA
      </div>
    ),
    { ...size }
  );
}
