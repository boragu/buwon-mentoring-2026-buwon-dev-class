'use client'

import { Check, RotateCcw, Star, Trophy, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getLevel, getPlayerRank } from '@/lib/game-config'
import type { AnswerRecord } from '@/hooks/use-quiz-game'
import type { QuizQuestion } from '@/lib/quiz-data'
import { Confetti } from './shared'
import { PokedexView } from './pokedex'

interface ResultScreenProps {
  correct: number
  wrong: number
  total: number
  points: number
  questions: QuizQuestion[]
  collectedIds: Set<string>
  answers: Record<string, AnswerRecord>
  onRestart: () => void
}

export function ResultScreen({
  correct,
  wrong,
  total,
  points,
  questions,
  collectedIds,
  answers,
  onRestart,
}: ResultScreenProps) {
  const rank = getPlayerRank(correct)
  const score = Math.round((correct / total) * 100)
  const { level } = getLevel(points)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <section className="relative animate-pop-in overflow-hidden rounded-[2rem] border-4 border-blue-800 bg-white text-center shadow-[0_8px_0_#1e3a8a]">
        <Confetti burstKey={1} />
        <div className={cn('bg-gradient-to-r px-6 py-8 text-white', rank.className)}>
          <Trophy className="mx-auto size-14 animate-bob drop-shadow-lg" aria-hidden="true" />
          <p className="mt-2 text-sm font-bold tracking-widest opacity-90">최종 플레이어 등급</p>
          <h2 className="font-display text-4xl [text-shadow:3px_3px_0_rgba(0,0,0,0.25)] sm:text-5xl">{rank.title}</h2>
          <p className="mt-1 text-sm font-bold opacity-90">Lv.{level} 트레이너</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:p-6">
          <div className="rounded-2xl bg-yellow-100 p-4">
            <dt className="text-xs font-bold text-amber-800">최종 점수</dt>
            <dd className="font-display text-3xl text-amber-600">
              {score}
              <span className="text-base">점</span>
            </dd>
          </div>
          <div className="rounded-2xl bg-emerald-100 p-4">
            <dt className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-800">
              <Check className="size-3.5" aria-hidden="true" /> 정답
            </dt>
            <dd className="font-display text-3xl text-emerald-600">{correct}</dd>
          </div>
          <div className="rounded-2xl bg-red-100 p-4">
            <dt className="flex items-center justify-center gap-1 text-xs font-bold text-red-800">
              <X className="size-3.5" aria-hidden="true" /> 오답
            </dt>
            <dd className="font-display text-3xl text-red-500">{wrong}</dd>
          </div>
          <div className="rounded-2xl bg-blue-100 p-4">
            <dt className="flex items-center justify-center gap-1 text-xs font-bold text-blue-800">
              <Star className="size-3.5" aria-hidden="true" /> 획득 PT
            </dt>
            <dd className="font-display text-3xl text-blue-600">{points.toLocaleString()}</dd>
          </div>
        </dl>

        <div className="px-4 pb-6">
          <Button
            onClick={onRestart}
            className="h-14 w-full max-w-xs rounded-full bg-red-500 font-display text-xl text-white shadow-[0_6px_0_#991b1b] hover:bg-red-600 active:translate-y-1 active:shadow-[0_2px_0_#991b1b]"
          >
            <RotateCcw className="size-5" aria-hidden="true" />
            다시 도전하기
          </Button>
        </div>
      </section>

      <section aria-labelledby="result-dex" className="rounded-[2rem] border-2 border-blue-200 bg-white p-4 shadow-sm sm:p-6">
        <h3 id="result-dex" className="mb-4 font-display text-2xl text-blue-800">
          나의 포켓몬 도감 & 아이템
        </h3>
        <PokedexView questions={questions} collectedIds={collectedIds} answers={answers} />
      </section>
    </div>
  )
}
