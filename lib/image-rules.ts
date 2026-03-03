export function applyImageRule(img: HTMLImageElement) {
  const { naturalWidth: w, naturalHeight: h } = img
  if (!w || !h) return
  const widthPct = w >= h ? 100 : Math.max(20, Math.round((w / h) * 100))
  img.style.setProperty('display', 'block', 'important')
  img.style.setProperty('width', `${widthPct}%`, 'important')
  img.style.setProperty('height', 'auto', 'important')
  img.style.setProperty('margin-left', 'auto', 'important')
  img.style.setProperty('margin-right', 'auto', 'important')
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
