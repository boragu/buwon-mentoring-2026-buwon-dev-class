'use client'

import { useEffect, useRef, useState } from 'react'
import { Gem, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RARITY, TYPE_COLORS } from '@/lib/game-config'
import { artworkUrl, type QuizQuestion, type Rarity } from '@/lib/quiz-data'

export function PokeBall({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-block aspect-square overflow-hidden rounded-full border-[3px] border-slate-900 bg-white',
        className,
      )}
    >
      <span className="absolute inset-x-0 top-0 h-1/2 bg-red-500" />
      <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-slate-900" />
      <span className="absolute top-1/2 left-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-slate-900 bg-white" />
    </span>
  )
}

export function RarityBadge({ rarity, className }: { rarity: Rarity; className?: string }) {
  const info = RARITY[rarity]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap',
        info.badgeClass,
        className,
      )}
    >
      <span aria-hidden="true">{info.symbol}</span>
      {info.label}
    </span>
  )
}

export function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-[11px] font-bold',
        TYPE_COLORS[type] ?? 'bg-slate-400 text-white',
      )}
    >
      {type}
    </span>
  )
}

export function PokemonArtwork({
  artworkId,
  name,
  silhouette = false,
  className,
}: {
  artworkId: number
  name: string
  silhouette?: boolean
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={artworkUrl(artworkId) || '/placeholder.svg'}
      alt={silhouette ? '정체를 알 수 없는 포켓몬의 실루엣' : name}
      crossOrigin="anonymous"
      loading="lazy"
      draggable={false}
      className={cn(
        'object-contain drop-shadow-lg transition-[filter] duration-700 select-none',
        silhouette && 'brightness-0 opacity-80',
        className,
      )}
    />
  )
}

export function PokemonCollectionCard({
  question,
  unlocked,
  points,
}: {
  question: QuizQuestion
  unlocked: boolean
  points?: number
}) {
  const info = RARITY[question.rarity]
  const { pokemon } = question

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 p-3 text-center">
        <div className="relative flex aspect-square w-full items-center justify-center">
          <PokemonArtwork
            artworkId={pokemon.artworkId}
            name={pokemon.name}
            silhouette
            className="size-full opacity-20"
          />
          <Lock className="absolute size-6 text-slate-500" aria-hidden="true" />
        </div>
        <p className="font-display text-sm text-slate-500">
          No.{String(pokemon.dexNo).padStart(4, '0')}
        </p>
        <p className="text-xs font-bold text-slate-400">???</p>
        <span className="sr-only">잠김 상태의 포켓몬</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-2xl border-2 bg-gradient-to-b p-3 text-center shadow-md',
        info.cardClass,
        info.glowClass,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <span className="font-display text-xs text-slate-600">
          No.{String(pokemon.dexNo).padStart(4, '0')}
        </span>
        <RarityBadge rarity={question.rarity} className="px-1.5 text-[10px]" />
      </div>
      <PokemonArtwork artworkId={pokemon.artworkId} name={pokemon.name} className="aspect-square w-full" />
      <p className="font-display text-base leading-tight text-slate-900">{pokemon.name}</p>
      <div className="flex flex-wrap justify-center gap-1">
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
      {points !== undefined && <p className="text-xs font-bold text-blue-700">+{points} PT</p>}
    </div>
  )
}

export function ItemCard({ question, compact = false }: { question: QuizQuestion; compact?: boolean }) {
  const info = RARITY[question.rarity]
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br shadow-md',
        info.cardClass,
        info.glowClass,
        compact ? 'p-3' : 'p-4',
      )}
    >
      <div className="absolute inset-0 animate-shine bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.7)_50%,transparent_65%)] bg-[length:250%_100%]" />
      <div className="relative flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-inner">
          <Gem className="size-6 text-blue-600" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="font-display text-base text-slate-900">{question.item.name}</p>
            <RarityBadge rarity={question.rarity} className="text-[10px]" />
          </div>
          {!compact && <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{question.item.description}</p>}
          <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            {info.english}
          </p>
        </div>
      </div>
    </div>
  )
}

export function AnimatedNumber({ value, duration = 700 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)

  useEffect(() => {
    const from = fromRef.current
    if (from === value) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
      else fromRef.current = value
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      fromRef.current = value
    }
  }, [value, duration])

  return <>{display.toLocaleString()}</>
}

const CONFETTI_COLORS = ['#FFCB05', '#3B82F6', '#EF4444', '#22C55E', '#A855F7', '#F97316']

export function Confetti({ burstKey }: { burstKey: number }) {
  const pieces = Array.from({ length: 36 }, (_, i) => {
    const angle = (i / 36) * Math.PI * 2
    const distance = 120 + ((i * 37) % 90)
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 40,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      rotate: (i * 47) % 360,
      delay: (i % 6) * 20,
    }
  })

  return (
    <div key={burstKey} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-visible">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-1/2 left-1/2 h-3 w-2 animate-confetti rounded-sm"
          style={
            {
              backgroundColor: p.color,
              '--tx': `${p.x}px`,
              '--ty': `${p.y}px`,
              '--rot': `${p.rotate + 360}deg`,
              animationDelay: `${p.delay}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
