'use client'

import { QUESTIONS } from '@/lib/exam/questions'
import { summarize } from '@/lib/exam/scoring'
import { useExam } from '@/lib/exam/use-exam'
import { IntroScreen } from './intro-screen'
import { ProgressHeader } from './progress-header'
import { QuestionCard } from './question-card'
import { ResultScreen } from './result-screen'

export function ExamApp() {
  const { state, hydrated, start, submit, next, reset } = useExam()

  if (!hydrated) {
    return (
      <main className="flex min-h-dvh items-center justify-center" aria-busy="true">
        <div className="size-8 animate-spin rounded-full border-2 border-foreground/15 border-t-foreground" />
        <span className="sr-only">시험지를 불러오는 중입니다</span>
      </main>
    )
  }

  if (state.status === 'intro') return <IntroScreen onStart={start} />

  if (state.status === 'finished') {
    return (
      <ResultScreen
        records={state.records}
        totalMs={state.finishedAt - state.examStartedAt}
        onRestart={reset}
      />
    )
  }

  const question = QUESTIONS[state.current]
  const record = state.records[state.current]
  const summary = summarize(state.records)

  return (
    <main className="min-h-dvh px-3 py-4 md:py-10">
      <div className="paper-sheet mx-auto w-full max-w-3xl">
        <ProgressHeader
          completed={state.records.length}
          total={QUESTIONS.length}
          currentNumber={state.current + 1}
          score={summary.baseScore}
          fastBonus={summary.fastBonus}
          streakBonus={summary.streakBonus}
          streak={summary.currentStreak}
        />
        <QuestionCard
          key={question.id}
          question={question}
          index={state.current}
          total={QUESTIONS.length}
          record={record}
          startedAt={state.questionStartedAt}
          isLast={state.current === QUESTIONS.length - 1}
          onSubmit={(response) => submit(state.current, response)}
          onNext={next}
        />
        <p className="pb-5 text-center font-serif text-sm text-muted-foreground" aria-hidden="true">
          - {state.current + 1} -
        </p>
      </div>
    </main>
  )
}
