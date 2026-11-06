'use client'

import { RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { QUESTIONS } from '@/lib/exam/questions'
import {
  formatDuration,
  formatSeconds,
  gradeMessage,
  MAX_SCORE,
  summarize,
  type AnswerRecord,
} from '@/lib/exam/scoring'
import { cn } from '@/lib/utils'
import { GradeMark } from './grade-mark'

function useCountUp(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / durationMs)
      setValue(Math.round(target * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, durationMs])
  return value
}

export function ResultScreen({
  records,
  totalMs,
  onRestart,
}: {
  records: AnswerRecord[]
  totalMs: number
  onRestart: () => void
}) {
  const s = summarize(records)
  const displayed = useCountUp(s.finalScore)

  const appliedNote =
    s.baseScore >= MAX_SCORE
      ? '기본 점수 만점으로 미적용'
      : s.appliedBonus < s.earnedBonus
        ? '100점 한도까지만 적용'
        : '전액 적용'

  const scoreRows = [
    { label: '기본 점수', note: `${s.correctCount}문항 정답`, value: `${s.baseScore}점` },
    { label: '빠른 정답 가산점', note: `6초 이내 정답 ${s.fastCount}문항 × 1점`, value: `+${s.fastBonus}점` },
    { label: '연속 정답 가산점', note: `최고 ${s.maxStreak}연속`, value: `+${s.streakBonus}점` },
    { label: '획득 가산점 합계', note: '빠른 정답 + 연속 정답', value: `+${s.earnedBonus}점` },
    { label: '적용 가산점', note: appliedNote, value: `+${s.appliedBonus}점` },
  ]

  const stats = [
    { label: '정답', value: `${s.correctCount}개` },
    { label: '오답', value: `${s.wrongCount}개` },
    { label: '정답률', value: `${s.accuracy}%` },
    { label: '소요 시간', value: formatDuration(totalMs) },
    { label: '최고 연속', value: `${s.maxStreak}문항` },
    { label: '6초 이내', value: `${s.fastCount}개` },
  ]

  return (
    <main className="min-h-dvh px-3 py-6 md:py-12">
      <article className="paper-sheet mx-auto w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 px-5 py-8 duration-500 md:px-12 md:py-12">
        <p className="text-center font-serif text-sm tracking-widest text-muted-foreground">
          2026학년도 온라인 수학 실력 평가
        </p>
        <h1 className="mt-3 border-y-4 border-double border-foreground py-3 text-center font-serif text-3xl font-black tracking-[0.25em] md:text-4xl">
          성적 통지표
        </h1>

        <section className="mt-8 flex flex-col items-center gap-6 md:flex-row md:items-stretch" aria-labelledby="final-title">
          <div className="flex shrink-0 flex-col items-center justify-center md:w-60">
            <h2 id="final-title" className="text-xs font-semibold tracking-widest text-muted-foreground">
              최종 점수
            </h2>
            <div className="relative mt-2 flex items-baseline px-6 py-2">
              <span className="font-serif text-7xl font-black tabular-nums text-pen md:text-8xl">
                {displayed}
              </span>
              <span className="ml-1 font-serif text-lg font-bold text-muted-foreground">/ {MAX_SCORE}</span>
              <GradeMark correct className="absolute -inset-4 size-[calc(100%+2rem)]" strokeWidth={3} />
            </div>
            <p className="mt-4 text-balance text-center font-serif text-lg font-bold">
              {gradeMessage(s.finalScore)}
            </p>
          </div>

          <table className="w-full border border-foreground text-sm">
            <caption className="sr-only">점수 산출 내역</caption>
            <tbody>
              {scoreRows.map((row) => (
                <tr key={row.label} className="border-b border-foreground/30">
                  <th scope="row" className="w-2/5 bg-muted px-3 py-2 text-left font-semibold">
                    {row.label}
                  </th>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{row.note}</td>
                  <td className="px-3 py-2 text-right font-serif font-bold tabular-nums">{row.value}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-foreground">
                <th scope="row" className="bg-muted px-3 py-2.5 text-left font-bold">
                  최종 점수
                </th>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">
                  {s.baseScore} + {s.appliedBonus}
                </td>
                <td className="px-3 py-2.5 text-right font-serif text-lg font-black tabular-nums text-pen">
                  {s.finalScore}점
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <dl className="mt-6 grid grid-cols-3 border-l border-t border-foreground md:grid-cols-6">
          {stats.map((item) => (
            <div key={item.label} className="border-b border-r border-foreground text-center">
              <dt className="border-b border-foreground/30 bg-muted py-1 text-xs font-semibold">
                {item.label}
              </dt>
              <dd className="px-1 py-2 font-serif text-sm font-bold tabular-nums md:text-base">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <section className="mt-8" aria-labelledby="review-title">
          <h2 id="review-title" className="font-serif text-lg font-bold">
            [문항별 채점표]
          </h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-lg border border-foreground text-sm">
              <thead className="bg-muted">
                <tr className="border-b border-foreground text-center">
                  <th scope="col" className="px-2 py-2 font-semibold">번호</th>
                  <th scope="col" className="px-2 py-2 font-semibold">유형</th>
                  <th scope="col" className="px-2 py-2 font-semibold">배점</th>
                  <th scope="col" className="px-2 py-2 font-semibold">채점</th>
                  <th scope="col" className="px-2 py-2 font-semibold">시간</th>
                  <th scope="col" className="px-2 py-2 font-semibold">빠른 정답</th>
                  <th scope="col" className="px-2 py-2 font-semibold">연속 정답</th>
                </tr>
              </thead>
              <tbody className="text-center font-serif tabular-nums">
                {records.map((r, i) => {
                  const q = QUESTIONS[i]
                  return (
                    <tr key={r.questionId} className="border-b border-foreground/20 last:border-0">
                      <td className="px-2 py-1.5 font-bold">{i + 1}</td>
                      <td className="px-2 py-1.5 font-sans text-xs">{q.type === 'mc' ? '선다형' : '단답형'}</td>
                      <td className="px-2 py-1.5">{q.points}</td>
                      <td className="px-2 py-1.5">
                        <span className="relative inline-flex size-7 items-center justify-center">
                          <GradeMark correct={r.correct} className="absolute inset-0 size-7" strokeWidth={8} />
                          <span className="sr-only">{r.correct ? '정답' : '오답'}</span>
                        </span>
                      </td>
                      <td className="px-2 py-1.5">{formatSeconds(r.elapsedMs)}</td>
                      <td className={cn('px-2 py-1.5', r.fastBonus ? 'font-bold text-pen' : 'text-muted-foreground')}>
                        {r.fastBonus ? `+${r.fastBonus}` : '-'}
                      </td>
                      <td className={cn('px-2 py-1.5', r.streakBonus ? 'font-bold text-pen' : 'text-muted-foreground')}>
                        {r.streakBonus ? `+${r.streakBonus} (${r.streakCount}연속)` : '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-10 flex justify-center">
          <Button
            onClick={onRestart}
            className="h-12 w-full gap-2 rounded-sm font-serif text-base font-bold tracking-widest transition-transform hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto sm:px-12"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            다시 풀기
          </Button>
        </div>
      </article>
    </main>
  )
}
