import { NextRequest } from 'next/server';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Docmaker';
    const subtitle = searchParams.get('subtitle') || 'Documents, done smoothly.';

    const svg = await satori(
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #121660 0%, #1a1f6e 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
        }}
      >
        <div
          style={{
            color: '#FFD140',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 40,
          }}
        >
          DOCMAKER
        </div>

        <div
          style={{
            color: 'white',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 24,
            maxWidth: 800,
          }}
        >
          {subtitle}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );

    const resvg = new Resvg(svg);
    const png = resvg.render();

    return new Response(png.asBuffer(), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('OG Image generation failed:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
