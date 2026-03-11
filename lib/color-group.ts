// h: 0–360, s: 0–100, l: 0–100
export function colorGroupFromHsl(h: number, s: number, l: number): string {
  if (l < 15) return 'Black'
  if (l > 85) return 'White'
  if (s < 15) return 'Grey'
  if (h >= 15 && h < 45 && l < 40) return 'Brown'
  if (h < 15 || h >= 345) return 'Red'
  if (h < 45)  return 'Orange'
  if (h < 75)  return 'Yellow'
  if (h < 165) return 'Green'
  if (h < 255) return 'Blue'
  if (h < 315) return 'Purple'
  return 'Pink'
}

// Fallback: derive from a hex string (used when only hex is stored, e.g. projects filter)
export function colorGroupFromHex(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) return colorGroupFromHsl(0, 0, l * 100)

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let hue: number
  switch (max) {
    case r: hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: hue = ((b - r) / d + 2) / 6; break
    default: hue = ((r - g) / d + 4) / 6
  }

  return colorGroupFromHsl(hue * 360, s * 100, l * 100)
}
