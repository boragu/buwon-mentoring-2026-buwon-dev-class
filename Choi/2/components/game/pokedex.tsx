'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMemo } from 'react'
import type { QuizQuestion } from '@/lib/quiz-data'
import type { AnswerRecord } from '@/hooks/use-quiz-game'
import { ItemCard, PokemonCollectionCard } from './shared'

export function PokedexView({
  questions,
  collectedIds,
  answers,
}: {
  questions: QuizQuestion[]
  collectedIds: Set<string>
  answers: Record<string, AnswerRecord>
}) {
  const SORTED = useMemo(
    () => [...questions].sort((a, b) => a.pokemon.dexNo - b.pokemon.dexNo || a.pokemon.artworkId - b.pokemon.artworkId),
    [questions],
  )
  const total = questions.length
  const completion = Math.round((collectedIds.size / total) * 100)
  const collectedItems = SORTED.filter((q) => collectedIds.has(q.id))

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-blue-600 p-4 text-white">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold text-blue-100">도감 완성률</p>
            <p className="font-display text-3xl text-yellow-300">{completion}%</p>
          </div>
          <p className="font-display text-lg">
            {collectedIds.size}
            <span className="text-blue-200"> / {total}</span>
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="도감 완성률"
          aria-valuenow={completion}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-2 h-3 overflow-hidden rounded-full bg-blue-900/60"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 transition-[width] duration-700"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <Tabs defaultValue="pokemon">
        <TabsList className="w-full">
          <TabsTrigger value="pokemon">포켓몬 ({collectedIds.size})</TabsTrigger>
          <TabsTrigger value="items">아이템 ({collectedItems.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pokemon" className="mt-3">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {SORTED.map((q) => (
              <li key={q.id}>
                <PokemonCollectionCard
                  question={q}
                  unlocked={collectedIds.has(q.id)}
                  points={answers[q.id]?.correct ? answers[q.id].points : undefined}
                />
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="items" className="mt-3">
          {collectedItems.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              아직 획득한 아이템이 없어요. 문제를 맞혀 아이템을 모아 보세요!
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {collectedItems.map((q) => (
                <li key={q.id}>
                  <ItemCard question={q} />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
