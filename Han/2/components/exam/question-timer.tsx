'use client'

import { useEffect, useState } from 'react'
import { FAST_LIMIT_MS, formatSeconds } from '@/lib/exam/scoring'
import { cn } from '@/lib/utils'

export function QuestionTimer({
  startedAt,
  stoppedMs,
}: {
  startedAt: number
  stoppedMs?: number
}) {
  const [now, setNow] = useState(() => Date.now())
  const running = stoppedMs === undefined

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(id)
  }, [running])

  const elapsed = running ? Math.max(0, now - startedAt) : stoppedMs
  const fastRemaining = Math.max(0, FAST_LIMIT_MS - elapsed)
  const fastActive = running && fastRemaining > 0

  return (
    <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
      <span
        className="font-mono text-sm font-semibold tabular-nums"
        aria-label={`경과 시간 ${formatSeconds(elapsed)}`}
      >
        {formatSeconds(elapsed)}
      </span>
      {running && (
        <span
          className={cn(
            'text-[11px] tabular-nums transition-colors',
            fastActive ? 'font-semibold text-pen' : 'text-muted-foreground',
          )}
        >
          {fastActive ? `빠른 정답 ${formatSeconds(fastRemaining)}` : '빠른 정답 시간 종료'}
        </span>
      )}
    </div>
  )
}
