import katex from 'katex'
import { Fragment, memo } from 'react'

function renderTex(tex: string) {
  return katex.renderToString(tex, { throwOnError: false, strict: false })
}

export const MathText = memo(function MathText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const parts = text.split(/(\$[^$]+\$)/g).filter(Boolean)
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.length > 1 && part.startsWith('$') && part.endsWith('$') ? (
          <span key={i} dangerouslySetInnerHTML={{ __html: renderTex(part.slice(1, -1)) }} />
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </span>
  )
})

export const MathTex = memo(function MathTex({ tex }: { tex: string }) {
  return <span dangerouslySetInnerHTML={{ __html: renderTex(tex) }} />
})
