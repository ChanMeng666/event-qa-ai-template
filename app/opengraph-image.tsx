import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config';

export const runtime = 'edge';
export const alt = `${siteConfig.name} - ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at 50% 40%, #10243f 0%, #050505 65%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '80px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 50% 45%, rgba(150,190,255,0.95) 0%, rgba(90,140,240,0.5) 45%, rgba(10,10,10,0) 72%)',
            boxShadow: '0 0 120px rgba(120,170,255,0.55)',
            marginBottom: 56,
          }}
        />
        <div
          style={{
            fontSize: 30,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: 24,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.55)',
            marginTop: 28,
          }}
        >
          {siteConfig.dates.displayFormat} - {siteConfig.venue.name}
        </div>
      </div>
    ),
    { ...size }
  );
}
