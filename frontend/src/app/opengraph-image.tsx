import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'KageWire — Editorial Anime, Donghua & Comic Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #090A0D 0%, #111318 60%, #1A1813 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* Subtle accent border */}
        <div
          style={{
            position: 'absolute',
            inset: '24px',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '24px',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '8px 24px',
            borderRadius: '999px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '999px',
              background: '#F59E0B',
            }}
          />
          <span
            style={{
              color: '#F59E0B',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            KageWire Platform
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 800,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: 0,
            maxWidth: '950px',
          }}
        >
          Editorial Anime, Donghua & Comic Hub
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '26px',
            color: '#9CA3AF',
            textAlign: 'center',
            marginTop: '24px',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Streaming anime & donghua sub Indo tercepat, baca manga, manhwa & manhua terlengkap.
        </p>

        {/* Bottom pill features */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '44px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 20px',
              borderRadius: '12px',
              color: '#E5E7EB',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            ⚡ Otakudesu & Samehadaku
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 20px',
              borderRadius: '12px',
              color: '#E5E7EB',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            🐉 Donghua Streaming
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 20px',
              borderRadius: '12px',
              color: '#E5E7EB',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            📖 Komikku Reader
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
