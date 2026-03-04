'use client'

import { useEffect, useRef } from 'react'
import { applyImageRulesToContainer } from '@/lib/image-rules'

interface ArticleContentProps {
  html: string
  className?: string
}

export function ArticleContent({ html, className }: ArticleContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) applyImageRulesToContainer(ref.current, 'img')
  }, [html])

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
