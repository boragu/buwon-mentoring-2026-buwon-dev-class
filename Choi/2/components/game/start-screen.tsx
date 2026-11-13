'use client'

import { useState } from 'react'
import { BookOpen, Dices, Loader2, Play, Shuffle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GameMode } from '@/hooks/use-quiz-game'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { DIFFICULTY, RARITY } from '@/lib/game-config'
import type { Rarity } from '@/lib/quiz-data'
import { PokemonArtwork } from './shared'

const HERO_POKEMON = [
  { id: 25, name: '피카츄' },
  { id: 6, name: '리자몽' },
  { id: 150, name: '뮤츠' },
]

const MODES: { value: GameMode; title: string; description: string; icon: typeof BookOpen }[] = [
  {
    value: 'classic',
    title: '마스터 퀴즈',
    description: '전설·메가진화·타입 상성 등 엄선된 25문제',
    icon: BookOpen,
  },
  {
    value: 'random',
    title: '전국도감 랜덤',
    description: '1025마리 중 무작위 25마리! 매번 새로운 문제',
    icon: Dices,
  },
]

export function StartScreen({
  defaultShuffle,
  defaultMode,
  loading,
  error,
  onStart,
}: {
  defaultShuffle: boolean
  defaultMode: GameMode
  loading: boolean
  error: string | null
  onStart: (shuffle: boolean, mode: GameMode) => void
}) {
  const [shuffle, setShuffle] = useState(defaultShuffle)
  const [mode, setMode] = useState<GameMode>(defaultMode)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <section className="relative overflow-hidden rounded-[2rem] border-4 border-blue-800 bg-gradient-to-b from-yellow-300 to-amber-300 p-6 text-center shadow-[0_8px_0_#1e3a8a] sm:p-10">
        <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/30" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-white/20" />

        <div className="relative flex items-end justify-center gap-1 sm:gap-4">
          {HERO_POKEMON.map((p, i) => (
            <PokemonArtwork
              key={p.id}
              artworkId={p.id}
              name={p.name}
              className={
                i === 1
                  ? 'size-36 animate-bob sm:size-48'
                  : 'size-24 animate-bob [animation-delay:400ms] sm:size-32'
              }
            />
          ))}
        </div>

        <h2 className="relative mt-4 font-display text-4xl text-blue-700 [text-shadow:3px_3px_0_#fff] sm:text-6xl">
          포켓몬 마스터 퀴즈
        </h2>
        <p className="relative mt-3 text-pretty text-sm font-semibold text-blue-950 sm:text-base">
          모드를 골라 25개의 문제를 풀고 포켓몬과 아이템을 모아 도감을 완성하세요!
        </p>

        <div className="relative mt-5 flex flex-wrap justify-center gap-2">
          {(Object.keys(DIFFICULTY) as (keyof typeof DIFFICULTY)[]).map((d) => (
            <span key={d} className={`rounded-full px-3 py-1 text-xs font-bold ${DIFFICULTY[d].className}`}>
              {DIFFICULTY[d].label}
            </span>
          ))}
        </div>
      </section>

      <section aria-labelledby="rarity-heading" className="rounded-3xl border-2 border-blue-200 bg-white p-5 shadow-sm">
        <h3 id="rarity-heading" className="font-display text-lg text-blue-800">
          문제 등급별 획득 포인트
        </h3>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(RARITY) as Rarity[]).map((r) => (
            <li
              key={r}
              className={`flex flex-col rounded-2xl border-2 bg-gradient-to-br px-3 py-2 ${RARITY[r].cardClass}`}
            >
              <span className="text-sm font-bold text-slate-800">
                <span aria-hidden="true">{RARITY[r].symbol} </span>
                {RARITY[r].label}
              </span>
              <span className="font-display text-lg text-blue-700">{RARITY[r].points}PT</span>
            </li>
          ))}
        </ul>
      </section>

      <fieldset className="rounded-3xl border-2 border-blue-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">게임 모드 선택</legend>
        <p aria-hidden="true" className="font-display text-lg text-blue-800">
          게임 모드
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {MODES.map((m) => {
            const selected = mode === m.value
            const Icon = m.icon
            return (
              <label
                key={m.value}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500',
                  selected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300',
                )}
              >
                <input
                  type="radio"
                  name="game-mode"
                  value={m.value}
                  checked={selected}
                  onChange={() => setMode(m.value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-full',
                    selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-700',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="font-bold text-blue-950">{m.title}</span>
                  <span className="text-pretty text-sm text-slate-600">{m.description}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="flex flex-col items-center gap-4">
        {error && (
          <p role="alert" className="rounded-2xl bg-rose-100 px-4 py-2 text-sm font-bold text-rose-800">
            {error} 잠시 후 다시 시도해 주세요.
          </p>
        )}
        <label className="flex cursor-pointer items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-blue-900 shadow-sm">
          <Shuffle className="size-4" aria-hidden="true" />
          문제·보기 순서 랜덤 섞기
          <Switch checked={shuffle} onCheckedChange={setShuffle} />
        </label>

        <Button
          onClick={() => onStart(shuffle, mode)}
          disabled={loading}
          className="h-14 w-full max-w-xs rounded-full bg-red-500 font-display text-xl text-white shadow-[0_6px_0_#991b1b] transition-transform hover:bg-red-600 active:translate-y-1 active:shadow-[0_2px_0_#991b1b]"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              포켓몬 찾는 중...
            </>
          ) : (
            <>
              <Play className="size-5 fill-white" aria-hidden="true" />
              모험 시작!
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
