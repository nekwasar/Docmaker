import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Docmaker';
    const subtitle = searchParams.get('subtitle') || 'Documents, done smoothly.';

    // Generate dynamic OG image using SVG (works for most platforms)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#121660;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1f6e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#grad)"/>
      <text x="80" y="120" fill="#FFD140" font-size="20" font-weight="bold" font-family="Arial, sans-serif" letter-spacing="2">DOCMAKER</text>
      <text x="80" y="280" fill="white" font-size="64" font-weight="bold" font-family="Arial, sans-serif">${title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
      <text x="80" y="360" fill="white" font-size="64" font-weight="bold" font-family="Arial, sans-serif">smoothly.</text>
      <text x="80" y="420" fill="rgba(255,255,255,0.7)" font-size="24" font-family="Arial, sans-serif">${subtitle.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
    </svg>`;

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('OG Image generation failed:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
