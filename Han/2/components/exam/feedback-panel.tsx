'use client'

import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CHOICE_MARKERS, type Question } from '@/lib/exam/questions'
import { formatSeconds, type AnswerRecord } from '@/lib/exam/scoring'
import { cn } from '@/lib/utils'
import { MathTex, MathText } from './math-text'

const AUTO_FINISH_SECONDS = 8

export function FeedbackPanel({
  question,
  record,
  isLast,
  onNext,
}: {
  question: Question
  record: AnswerRecord
  isLast: boolean
  onNext: () => void
}) {
  const nextRef = useRef<HTMLButtonElement>(null)
  const [countdown, setCountdown] = useState(AUTO_FINISH_SECONDS)

  useEffect(() => {
    nextRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isLast) return
    if (countdown <= 0) {
      onNext()
      return
    }
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => window.clearTimeout(id)
  }, [isLast, countdown, onNext])

  const { correct } = record

  return (
    <section
      aria-live="polite"
      className="relative mt-8 animate-in fade-in slide-in-from-bottom-2 border-t-2 border-dashed border-foreground/40 pt-6 duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">채점 결과</p>
          <p className="mt-1 font-serif text-2xl font-black text-pen">
            {correct ? '정답입니다!' : '오답입니다!'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {correct ? '정답을 맞힌 시간' : '제출까지 걸린 시간'}: {formatSeconds(record.elapsedMs)}
          </p>
        </div>
        {correct && (
          <div className="relative flex flex-col items-end">
            <span className="animate-stamp rounded-sm border-[3px] border-pen px-3 py-1 font-serif text-2xl font-black text-pen opacity-0">
              +{record.earnedPoints}점
            </span>
            {record.bonus > 0 && (
              <span
                className="animate-float-up absolute -top-6 right-0 whitespace-nowrap text-sm font-bold text-pen opacity-0"
                style={{ animationDelay: '0.35s' }}
                aria-hidden="true"
              >
                가산점 +{record.bonus}
              </span>
            )}
          </div>
        )}
      </div>

      {correct && (
        <dl className="mt-5 grid grid-cols-2 border border-foreground/60 text-sm">
          <BonusCell
            label="빠른 정답"
            detail={record.fast ? '6초 이내' : '6초 초과'}
            value={record.fastBonus}
          />
          <BonusCell
            label="연속 정답"
            detail={record.streakCount >= 2 ? `${record.streakCount}연속` : '연속 아님'}
            value={record.streakBonus}
            className="border-l border-foreground/60"
          />
        </dl>
      )}

      {!correct && (
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-l-4 border-pen bg-muted/60 px-4 py-3">
            <span className="text-sm font-semibold text-muted-foreground">정답</span>
            <span className="flex items-center gap-2 font-serif text-xl font-bold">
              {question.type === 'mc' ? (
                <>
                  <span aria-hidden="true">{CHOICE_MARKERS[question.answerIndex]}</span>
                  <span className="sr-only">{question.answerIndex + 1}번</span>
                  <MathTex tex={question.choices[question.answerIndex].tex} />
                </>
              ) : (
                question.answer
              )}
            </span>
          </div>
          <div className="border border-foreground/60 p-4">
            <p className="font-serif font-bold">[해설]</p>
            <ol className="mt-2 flex flex-col gap-1.5 font-serif leading-loose">
              {question.solution.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 font-sans text-sm font-bold text-muted-foreground">
                    ({i + 1})
                  </span>
                  <MathText text={line} />
                </li>
              ))}
            </ol>
          </div>
          <p className="text-xs text-muted-foreground">오답이므로 연속 정답 기록이 초기화되었습니다.</p>
        </div>
      )}

      <Button
        ref={nextRef}
        onClick={onNext}
        className="mt-6 h-12 w-full gap-2 rounded-sm font-serif text-base font-bold tracking-wider transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
      >
        {isLast ? (
          `성적표 보기 (${countdown}초 후 자동 이동)`
        ) : (
          <>
            다음 문항
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </Button>
    </section>
  )
}

function BonusCell({
  label,
  detail,
  value,
  className,
}: {
  label: string
  detail: string
  value: number
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-between gap-2 px-3 py-2.5', className)}>
      <div>
        <dt className="font-semibold">{label}</dt>
        <dd className="text-xs text-muted-foreground">{detail}</dd>
      </div>
      <dd
        className={cn(
          'font-serif text-xl font-black tabular-nums',
          value > 0 ? 'text-pen' : 'text-muted-foreground/60',
        )}
      >
        +{value}
      </dd>
    </div>
  )
}
