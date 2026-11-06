'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CHOICE_MARKERS, type Question } from '@/lib/exam/questions'
import { normalizeAnswer, type AnswerRecord } from '@/lib/exam/scoring'
import { cn } from '@/lib/utils'
import { FeedbackPanel } from './feedback-panel'
import { GradeMark } from './grade-mark'
import { MathTex, MathText } from './math-text'
import { QuestionTimer } from './question-timer'

export function QuestionCard({
  question,
  index,
  total,
  record,
  startedAt,
  isLast,
  onSubmit,
  onNext,
}: {
  question: Question
  index: number
  total: number
  record?: AnswerRecord
  startedAt: number
  isLast: boolean
  onSubmit: (response: string) => void
  onNext: () => void
}) {
  const [draft, setDraft] = useState('')
  const submitted = record !== undefined
  const response = submitted ? record.response : draft
  const canSubmit = !submitted && normalizeAnswer(draft).length > 0

  const handleSubmit = () => {
    if (canSubmit) onSubmit(draft)
  }

  return (
    <article
      className="animate-in fade-in px-5 pb-6 pt-4 duration-300 md:px-10 md:pt-6"
      aria-labelledby={`q-${question.id}-title`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-sm border border-foreground/60 px-1.5 py-0.5 text-xs font-semibold">
          {question.type === 'mc' ? '5지 선다형' : '단답형'}
        </span>
        <QuestionTimer startedAt={startedAt} stoppedMs={record?.elapsedMs} />
      </div>

      <div className="mt-3 flex gap-3">
        <h2
          id={`q-${question.id}-title`}
          className="relative shrink-0 font-serif text-2xl font-black leading-snug md:text-3xl"
        >
          {index + 1}.
          <span className="sr-only">
            {' '}
            / {total}번 문항
          </span>
          {submitted && (
            <GradeMark
              correct={record.correct}
              className="absolute -left-3 -top-3 size-14 md:size-16"
            />
          )}
        </h2>
        <p className="text-pretty pt-1 font-serif text-lg leading-loose md:text-xl">
          <MathText text={question.prompt} />{' '}
          <span className="whitespace-nowrap font-sans text-base font-bold">[{question.points}점]</span>
        </p>
      </div>

      {question.type === 'mc' ? (
        <div
          role="radiogroup"
          aria-label="선택지"
          className="mt-6 grid grid-cols-1 gap-1 sm:grid-cols-2 md:pl-10"
        >
          {question.choices.map((choice, i) => {
            const selected = response === String(i)
            const isAnswer = i === question.answerIndex
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={submitted}
                onClick={() => setDraft(String(i))}
                className={cn(
                  'group flex min-h-12 items-center gap-3 rounded-sm px-3 py-2 text-left font-serif text-lg transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  !submitted && 'hover:bg-muted',
                  !submitted && selected && 'bg-muted',
                  submitted && !isAnswer && !selected && 'opacity-45',
                )}
              >
                <span className="relative flex size-8 shrink-0 items-center justify-center" aria-hidden="true">
                  <span
                    className={cn(
                      'flex size-7 items-center justify-center rounded-full border-[1.5px] border-foreground font-sans text-sm font-bold transition-colors',
                      selected && 'bg-foreground text-paper',
                    )}
                  >
                    {i + 1}
                  </span>
                  {submitted && isAnswer && (
                    <GradeMark correct className="absolute -inset-2.5 size-[52px]" strokeWidth={5} />
                  )}
                  {submitted && selected && !isAnswer && (
                    <GradeMark correct={false} className="absolute -inset-1 size-10" strokeWidth={5} />
                  )}
                </span>
                <span className="sr-only">
                  {CHOICE_MARKERS[i]} {i + 1}번
                  {submitted && isAnswer ? ', 정답' : ''}
                  {submitted && selected && !isAnswer ? ', 선택한 오답' : ''}
                </span>
                <MathTex tex={choice.tex} />
              </button>
            )
          })}
        </div>
      ) : (
        <div className="mt-8 flex items-end gap-3 md:pl-10">
          <label htmlFor={`answer-${question.id}`} className="pb-2 font-serif text-lg font-bold">
            답:
          </label>
          <div className="relative w-full max-w-xs">
            <input
              id={`answer-${question.id}`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              placeholder="숫자 입력"
              value={response}
              disabled={submitted}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' || e.nativeEvent.isComposing || e.keyCode === 229) return
                e.preventDefault()
                handleSubmit()
              }}
              className={cn(
                'h-12 w-full border-b-2 border-foreground bg-transparent px-2 font-serif text-2xl font-bold tabular-nums outline-none transition-colors placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground/70',
                'focus-visible:border-pen focus-visible:bg-muted/60',
                submitted && !record.correct && 'line-through decoration-pen decoration-2',
              )}
            />
            {submitted && (
              <GradeMark
                correct={record.correct}
                className="absolute -right-2 -top-4 size-16"
              />
            )}
          </div>
        </div>
      )}

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-8 h-12 w-full rounded-sm font-serif text-base font-bold tracking-widest transition-transform hover:bg-primary/90 enabled:hover:-translate-y-0.5"
        >
          답안 제출
        </Button>
      )}

      {submitted && (
        <FeedbackPanel question={question} record={record} isLast={isLast} onNext={onNext} />
      )}
    </article>
  )
}
