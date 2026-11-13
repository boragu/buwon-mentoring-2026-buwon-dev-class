'use client'

import { ArrowRight, Check, Trophy, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DIFFICULTY, RARITY } from '@/lib/game-config'
import type { AnswerRecord, DisplayQuestion } from '@/hooks/use-quiz-game'
import { Confetti, PokemonArtwork, RarityBadge } from './shared'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

interface QuestionCardProps {
  question: DisplayQuestion
  answer: AnswerRecord | undefined
  questionNumber: number
  total: number
  onAnswer: (originalIndex: number) => void
  onNext: () => void
}

export function QuestionCard({ question, answer, questionNumber, total, onAnswer, onNext }: QuestionCardProps) {
  const answered = Boolean(answer)
  const rarity = RARITY[question.rarity]
  const isLast = questionNumber === total

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 sm:py-8">
      <article
        key={question.id}
        className={cn(
          'relative rounded-[2rem] border-4 border-blue-800 bg-white shadow-[0_8px_0_#1e3a8a]',
          answer && !answer.correct ? 'animate-shake' : 'animate-pop-in',
        )}
      >
        {answer?.correct && <Confetti burstKey={questionNumber} />}

        <div className="flex flex-wrap items-center gap-2 rounded-t-[1.7rem] bg-gradient-to-r from-yellow-300 to-amber-300 px-4 py-3 sm:px-6">
          <span className="font-display text-xl text-blue-800">Q{questionNumber}</span>
          <span className="rounded-full bg-blue-700 px-2.5 py-0.5 text-xs font-bold text-white">
            {question.category}
          </span>
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', DIFFICULTY[question.difficulty].className)}>
            {DIFFICULTY[question.difficulty].label}
          </span>
          <RarityBadge rarity={question.rarity} />
          <span className="ml-auto font-display text-sm text-blue-900">+{rarity.points}PT</span>
        </div>

        <div className="grid gap-5 p-4 sm:grid-cols-[200px_1fr] sm:p-6">
          <div
            className={cn(
              'relative mx-auto flex aspect-square w-40 items-center justify-center overflow-hidden rounded-3xl border-2 bg-gradient-to-br sm:w-full',
              rarity.cardClass,
            )}
          >
            <div className="absolute inset-4 rounded-full bg-white/50 blur-xl" />
            <PokemonArtwork
              artworkId={question.pokemon.artworkId}
              name={question.pokemon.name}
              silhouette={!answer?.correct}
              className={cn('relative size-[88%]', answer?.correct && 'animate-reveal')}
            />
            <span className="absolute bottom-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-blue-900 shadow">
              {answer?.correct ? `${question.pokemon.name} 획득!` : answered ? '포획 실패...' : '보상 포켓몬은?'}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-pretty font-display text-xl leading-snug text-slate-900 sm:text-2xl">
              {question.question}
            </h2>

            <div role="group" aria-label="보기" className="grid gap-2.5 sm:grid-cols-2">
              {question.displayOptions.map((opt, i) => {
                const isCorrect = opt.originalIndex === question.answer
                const isSelected = answer?.selected === opt.originalIndex
                return (
                  <button
                    key={opt.originalIndex}
                    type="button"
                    disabled={answered}
                    onClick={() => onAnswer(opt.originalIndex)}
                    aria-pressed={isSelected}
                    className={cn(
                      'group flex min-h-14 items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left font-bold transition-all focus-visible:ring-4 focus-visible:ring-yellow-300 focus-visible:outline-none',
                      !answered &&
                        'border-blue-200 bg-blue-50 text-blue-950 shadow-[0_4px_0_#bfdbfe] hover:-translate-y-0.5 hover:border-blue-500 hover:bg-yellow-50 active:translate-y-0.5 active:shadow-none',
                      answered && isCorrect && 'border-emerald-500 bg-emerald-100 text-emerald-900 shadow-[0_4px_0_#10b981]',
                      answered && isSelected && !isCorrect && 'border-red-400 bg-red-100 text-red-900',
                      answered && !isCorrect && !isSelected && 'border-slate-200 bg-slate-50 text-slate-400',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-full font-display text-sm',
                        !answered && 'bg-blue-600 text-white group-hover:bg-yellow-400 group-hover:text-blue-900',
                        answered && isCorrect && 'bg-emerald-500 text-white',
                        answered && isSelected && !isCorrect && 'bg-red-500 text-white',
                        answered && !isCorrect && !isSelected && 'bg-slate-200 text-slate-400',
                      )}
                    >
                      {answered && isCorrect ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : answered && isSelected ? (
                        <X className="size-4" aria-hidden="true" />
                      ) : (
                        OPTION_LABELS[i]
                      )}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {answered && isCorrect && <span className="sr-only">(정답)</span>}
                    {answered && isSelected && !isCorrect && <span className="sr-only">(선택한 오답)</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </article>

      {answer && (
        <section
          aria-live="polite"
          className={cn(
            'flex animate-slide-up flex-col gap-3 rounded-3xl border-2 p-4 sm:flex-row sm:items-center sm:p-5',
            answer.correct ? 'border-emerald-400 bg-emerald-50' : 'border-red-300 bg-red-50',
          )}
        >
          <div
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-full text-white',
              answer.correct ? 'bg-emerald-500' : 'bg-red-400',
            )}
          >
            {answer.correct ? <Check className="size-7" aria-hidden="true" /> : <X className="size-7" aria-hidden="true" />}
          </div>
          <div className="flex-1">
            <p className={cn('font-display text-xl', answer.correct ? 'text-emerald-700' : 'text-red-600')}>
              {answer.correct ? `정답! +${answer.points}PT 획득` : '아쉬워요! 오답입니다'}
            </p>
            {!answer.correct && (
              <p className="mt-0.5 text-sm font-bold text-slate-800">
                정답: <span className="text-emerald-700">{question.options[question.answer]}</span>
              </p>
            )}
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{question.explanation}</p>
          </div>
          <Button
            onClick={onNext}
            autoFocus
            className="h-12 shrink-0 rounded-full bg-blue-600 px-6 font-display text-base text-white shadow-[0_4px_0_#1e3a8a] hover:bg-blue-700 active:translate-y-0.5 active:shadow-none"
          >
            {isLast ? (
              <>
                결과 보기 <Trophy className="size-4" aria-hidden="true" />
              </>
            ) : (
              <>
                다음 문제 <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </section>
      )}
    </div>
  )
}
