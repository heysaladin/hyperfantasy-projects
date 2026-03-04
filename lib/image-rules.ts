export function applyImageRule(img: HTMLImageElement) {
  const { naturalWidth: w, naturalHeight: h } = img
  if (!w || !h) return

  img.style.setProperty('display', 'block', 'important')
  img.style.setProperty('margin-left', 'auto', 'important')
  img.style.setProperty('margin-right', 'auto', 'important')

  if (w >= h) {
    // Landscape: full width, natural proportions
    img.style.setProperty('width', '100%', 'important')
    img.style.setProperty('height', 'auto', 'important')
    img.style.removeProperty('aspect-ratio')
    img.style.setProperty('object-fit', 'cover', 'important')
  } else {
    // Portrait: width narrows proportionally to how tall it is, natural height
    const widthPct = Math.max(20, Math.round((w / h) * 100))
    img.style.setProperty('width', `${widthPct}%`, 'important')
    img.style.setProperty('height', 'auto', 'important')
    img.style.removeProperty('aspect-ratio')
    img.style.removeProperty('object-fit')
    img.style.removeProperty('object-position')
  }
}

export function applyImageRulesToContainer(container: Element, selector = 'img') {
  const images = container.querySelectorAll<HTMLImageElement>(selector)
  images.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      applyImageRule(img)
    } else {
      img.addEventListener('load', () => applyImageRule(img), { once: true })
      if (img.complete) {
        const probe = new window.Image()
        probe.onload = () => applyImageRule(img)
        probe.src = img.src
      }
    }
  })
}
