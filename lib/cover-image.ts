const UNSPLASH_FALLBACKS = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
]

function isLocalUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return hostname === 'blog.hyperfantasy.local' || !hostname.includes('.')
  } catch {
    return true
  }
}

export function resolveCoverImage(url: string | null | undefined, seed: string): string {
  if (!url || isLocalUrl(url)) {
    const index = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % UNSPLASH_FALLBACKS.length
    return UNSPLASH_FALLBACKS[index]
  }
  return url
}
