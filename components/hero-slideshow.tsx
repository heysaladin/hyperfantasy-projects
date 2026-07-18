'use client'

import { useEffect, useRef, useState } from 'react'

const IMAGES = [
  'https://cdn.dribbble.com/userupload/3223425/file/original-e4ec2c93d78160d853ff4f41d0bb60c2.png',
  'https://cdn.dribbble.com/userupload/2582828/file/original-0f841afee9aae886bf5727f7f9fc2cb2.png',
  'https://cdn.dribbble.com/users/8414462/screenshots/16336374/media/dcf4d86fdc362093e288b84138c6aaec.jpg?compress=1&resize=1200x900&vertical=top',
  'https://cdn.dribbble.com/users/8414462/screenshots/16384402/media/c6780abbdc2f8767015da1ee17462fcb.jpg?compress=1&resize=1200x900&vertical=top',
  'https://cdn.dribbble.com/userupload/10029229/file/original-38d08e65a93bee5cf670d621acfcb290.png?resize=2048x1536&vertical=center',
  'https://cdn.dribbble.com/users/8414462/screenshots/16294202/media/702fd2eb7950c5a03f2122ff5ae8dd85.jpg',
  'https://cdn.dribbble.com/userupload/3223593/file/original-8c70ce82e7e2fc4330a0fae3cc629344.png',
  'https://cdn.dribbble.com/users/8414462/screenshots/17216266/media/b1c288ff145b3b714f18f5ff71881381.png',
  'https://cdn.dribbble.com/userupload/4029144/file/original-4218bf4ee17eb0d1e2b2ed9041ff85c3.png',
  'https://cdn.dribbble.com/userupload/9838450/file/original-fa437e041731bdc0d2247159a6061df4.png?resize=2048x1536&vertical=center',
  'https://cdn.dribbble.com/userupload/4394995/file/original-76bb747005b619a94a3e30f5b7d20a11.png',
  'https://cdn.dribbble.com/userupload/4876248/file/original-e9fa53b9306b99a9d9aa6b1e53a0aff5.png?compress=1&resize=1504x1128',
  'https://cdn.dribbble.com/userupload/4899099/file/original-ec1a644b5f8fcfac27755ca46a92790a.png?compress=1&resize=1504x1128',
  'https://cdn.dribbble.com/userupload/4803971/file/original-a6f5bc391ef0e57d8a5f3cb7db811ea0.png?compress=1&resize=2048x1535',
  'https://mir-s3-cdn-cf.behance.net/project_modules/fs/38ae0c142316807.6264a81a99d53.png',
  'https://mir-s3-cdn-cf.behance.net/project_modules/fs/c425b8142316551.6264a5a7e008f.png',
  'https://mir-s3-cdn-cf.behance.net/project_modules/fs/6b1d54138970043.622807cba6242.png',
  'https://mir-s3-cdn-cf.behance.net/project_modules/fs/4bfd4c138970509.622809b25f730.png',
  'https://mir-s3-cdn-cf.behance.net/project_modules/fs/29e985138970301.622808f0746ba.png',
  'https://cdn.dribbble.com/userupload/11733553/file/original-b794b3adc47300996d36e749e27ecf5e.png?resize=1504x1128&vertical=center',
  'https://cdn.dribbble.com/userupload/2907401/file/original-05a06171e691c927101533ca4518780c.png',
]

export function HeroSlideshow() {
  const [idx, setIdx] = useState(0)
  const ready = useRef(false)

  // Preload all images into browser memory before starting the loop
  useEffect(() => {
    if (ready.current) return
    ready.current = true

    let loaded = 0
    IMAGES.forEach(src => {
      const img = new window.Image()
      img.onload = () => {
        loaded++
        // Start cycling only after first image is ready
        if (loaded === 1) {
          const id = setInterval(() => setIdx(i => (i + 1) % IMAGES.length), 500)
          // Store interval id for cleanup via the next effect's return
          ;(window as any).__heroSlideshowId = id
        }
      }
      img.src = src
    })

    return () => {
      clearInterval((window as any).__heroSlideshowId)
    }
  }, [])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={IMAGES[idx]}
      alt=""
      aria-hidden="true"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fetchPriority="high"
      decoding="async"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'top',
      }}
    />
  )
}
