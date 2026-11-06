export function ProgressHeader({
  completed,
  total,
  currentNumber,
  score,
  fastBonus,
  streakBonus,
  streak,
}: {
  completed: number
  total: number
  currentNumber: number
  score: number
  fastBonus: number
  streakBonus: number
  streak: number
}) {
  const percent = Math.round((completed / total) * 100)

  return (
    <header className="sticky top-0 z-20 bg-paper/95 px-5 pt-4 backdrop-blur-sm md:px-10 md:pt-6">
      <div className="flex items-end justify-between gap-3 border-b-4 border-double border-foreground pb-2">
        <div className="flex items-baseline gap-2">
          <span className="rounded-sm border border-foreground px-1.5 py-0.5 text-xs font-semibold">
            제 2 교시
          </span>
          <span className="font-serif text-lg font-black tracking-[0.2em] md:text-xl">수학 영역</span>
        </div>
        <span className="font-serif text-sm font-bold tabular-nums">
          {currentNumber} / {total}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-xs">
        <dl className="flex flex-wrap items-center gap-x-3 gap-y-1 tabular-nums">
          <div className="flex gap-1">
            <dt className="text-muted-foreground">기본</dt>
            <dd className="font-bold">{score}점</dd>
          </div>
          <div className="flex gap-1">
            <dt className="text-muted-foreground">빠른 정답</dt>
            <dd className="font-bold text-pen">+{fastBonus}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="text-muted-foreground">연속 정답</dt>
            <dd className="font-bold text-pen">+{streakBonus}</dd>
          </div>
          {streak >= 2 && (
            <div className="rounded-sm border border-pen px-1.5 font-bold text-pen">
              <dt className="sr-only">현재 연속</dt>
              <dd>{streak}연속 중</dd>
            </div>
          )}
        </dl>
        <div className="flex items-center gap-2">
          <div
            className="h-1.5 w-24 overflow-hidden rounded-full border border-foreground/40 sm:w-32"
            role="progressbar"
            aria-label="시험 진행률"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            <div
              className="h-full bg-foreground transition-[width] duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="font-semibold tabular-nums">
            {completed}/{total} 완료 · {percent}%
          </span>
        </div>
      </div>
    </header>
  )
}
