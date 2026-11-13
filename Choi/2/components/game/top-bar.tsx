'use client'

import { useEffect, useRef, useState } from 'react'
import { BookOpen, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getLevel } from '@/lib/game-config'
import { AnimatedNumber, PokeBall } from './shared'

interface TopBarProps {
  points: number
  currentIndex: number
  total: number
  answeredCount: number
  collectedCount: number
  showProgress: boolean
  onOpenPokedex: () => void
}

export function TopBar({
  points,
  currentIndex,
  total,
  answeredCount,
  collectedCount,
  showProgress,
  onOpenPokedex,
}: TopBarProps) {
  const { level, progress } = getLevel(points)
  const [gain, setGain] = useState<{ amount: number; key: number } | null>(null)
  const prevPoints = useRef(points)

  useEffect(() => {
    const diff = points - prevPoints.current
    prevPoints.current = points
    if (diff > 0) setGain({ amount: diff, key: Date.now() })
  }, [points])

  const progressPercent = (answeredCount / total) * 100

  return (
    <header className="sticky top-0 z-30 border-b-4 border-blue-800 bg-blue-600 text-white shadow-lg">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-3 py-2.5 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <PokeBall className="size-7 shrink-0 sm:size-8" />
            <h1 className="truncate font-display text-lg text-yellow-300 [text-shadow:2px_2px_0_#1e3a8a] sm:text-2xl">
              포켓몬 마스터 퀴즈
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            <div
              className="flex items-center gap-1.5 rounded-full bg-blue-800/60 py-1 pr-3 pl-1"
              aria-label={`플레이어 레벨 ${level}`}
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-yellow-300 font-display text-sm text-blue-900">
                {level}
              </span>
              <div className="hidden flex-col sm:flex">
                <span className="text-[10px] leading-none font-bold text-blue-100">LEVEL</span>
                <span className="mt-1 h-1.5 w-14 overflow-hidden rounded-full bg-blue-950/50">
                  <span
                    className="block h-full rounded-full bg-yellow-300 transition-[width] duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </span>
              </div>
            </div>

            <div className="relative flex items-center gap-1 rounded-full bg-yellow-300 px-3 py-1 font-display text-blue-900 shadow-[0_3px_0_#b45309]">
              <Star className="size-4 fill-blue-900" aria-hidden="true" />
              <span className="tabular-nums">
                <AnimatedNumber value={points} />
              </span>
              <span className="text-xs">PT</span>
              {gain && (
                <span
                  key={gain.key}
                  aria-hidden="true"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 animate-float-up font-display text-lg whitespace-nowrap text-yellow-300 [text-shadow:2px_2px_0_#1e3a8a]"
                >
                  +{gain.amount}
                </span>
              )}
            </div>

            <Button
              onClick={onOpenPokedex}
              size="sm"
              className="h-8 rounded-full bg-red-500 px-3 font-bold text-white shadow-[0_3px_0_#991b1b] hover:bg-red-600"
            >
              <BookOpen className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">도감</span>
              <span className="text-xs tabular-nums">
                {collectedCount}/{total}
              </span>
            </Button>
          </div>
        </div>

        {showProgress && (
          <div className="flex items-center gap-3">
            <span className="shrink-0 font-display text-sm text-yellow-200">
              Q{Math.min(currentIndex + 1, total)}
              <span className="text-blue-200">/{total}</span>
            </span>
            <div
              role="progressbar"
              aria-label="문제 진행률"
              aria-valuenow={Math.round(progressPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-3 flex-1 overflow-hidden rounded-full border-2 border-blue-900 bg-blue-950/40"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 transition-[width] duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-bold text-blue-100 tabular-nums">
              {Math.round(progressPercent)}%
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
