import { NextRequest, NextResponse } from 'next/server'
import { Vibrant } from 'node-vibrant/node'
import { colorGroupFromHsl } from '@/lib/color-group'
import sharp from 'sharp'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  try {
    // Fetch the image server-side with browser-like headers so CDNs (Dribbble, etc.) don't block us
    // Exclude WebP/AVIF from Accept so CDNs return JPEG/PNG — node-vibrant doesn't support WebP
    const imageRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/png,image/jpeg,image/jpg,*/*;q=0.8',
        'Referer': new URL(url).origin + '/',
      },
    })

    if (!imageRes.ok) {
      return NextResponse.json(
        { error: `Could not fetch image: ${imageRes.status} ${imageRes.statusText}` },
        { status: 502 }
      )
    }

    const arrayBuffer = await imageRes.arrayBuffer()
    let buffer: Buffer = Buffer.from(arrayBuffer)

    // Convert to JPEG via sharp if the CDN returns WebP/AVIF regardless of Accept header
    const contentType = imageRes.headers.get('content-type') ?? ''
    if (contentType.includes('webp') || contentType.includes('avif')) {
      buffer = await sharp(buffer).jpeg().toBuffer()
    }

    const palette = await Vibrant.from(buffer).getPalette()
    const swatches = Object.values(palette).filter(Boolean)
    if (!swatches.length) {
      return NextResponse.json({ error: 'No palette extracted' }, { status: 422 })
    }

    // Pick the swatch with the highest pixel population (true dominant color)
    const dominant = swatches.reduce((a, b) => (a!.population > b!.population ? a : b))!

    const hex = dominant.hex.toUpperCase()
    // Use Vibrant's own HSL values (h/s/l each 0–1) to classify the color group
    const [h, s, l] = dominant.hsl
    const colorGroup = colorGroupFromHsl(h * 360, s * 100, l * 100)

    return NextResponse.json({ hex, colorGroup })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to extract color' }, { status: 500 })
  }
}
