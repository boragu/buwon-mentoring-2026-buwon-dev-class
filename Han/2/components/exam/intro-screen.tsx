import { PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SCORE_TABLE = [
  { label: '객관식', points: 3, count: 4 },
  { label: '객관식', points: 4, count: 7 },
  { label: '객관식', points: 5, count: 4 },
  { label: '주관식', points: 8, count: 5 },
]

const RULES = [
  '문제는 한 면에 하나씩 출제되며, 1번부터 순서대로 풉니다.',
  '한 번 제출한 답은 변경할 수 없습니다.',
  '문항마다 풀이 시간이 측정되며, 다음 문항으로 넘어가면 초기화됩니다.',
  '주관식은 숫자로 답하며, 공백은 무시하고 채점합니다.',
]

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="min-h-dvh px-3 py-6 md:py-12">
      <article className="paper-sheet mx-auto w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 px-5 py-8 duration-500 md:px-12 md:py-12">
        <p className="text-center font-serif text-sm tracking-widest text-muted-foreground">
          2026학년도 온라인 수학 실력 평가 문제지
        </p>

        <header className="mt-5 flex items-center justify-between gap-4 border-y-4 border-double border-foreground py-4">
          <span className="rounded-sm border-2 border-foreground px-2 py-1 font-serif text-sm font-bold md:text-base">
            제 2 교시
          </span>
          <h1 className="font-serif text-4xl font-black tracking-[0.3em] md:text-6xl">수학 영역</h1>
          <span className="hidden w-[72px] sm:block" aria-hidden="true" />
        </header>

        <dl className="mt-6 grid grid-cols-3 border border-foreground text-center">
          {[
            { label: '문항 수', value: '20문항' },
            { label: '구성', value: '객관식 15 · 주관식 5' },
            { label: '만점', value: '100점' },
          ].map((item, i) => (
            <div key={item.label} className={i > 0 ? 'border-l border-foreground' : undefined}>
              <dt className="border-b border-foreground bg-muted py-1.5 text-xs font-semibold md:text-sm">
                {item.label}
              </dt>
              <dd className="px-1 py-3 font-serif text-sm font-bold md:text-lg">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:gap-0">
          <section className="flex-1 md:border-r md:border-foreground/30 md:pr-8" aria-labelledby="score-title">
            <h2 id="score-title" className="font-serif text-lg font-bold">
              [배점 안내]
            </h2>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="border-b border-foreground text-left">
                  <th scope="col" className="py-1.5 font-semibold">유형</th>
                  <th scope="col" className="py-1.5 font-semibold">배점</th>
                  <th scope="col" className="py-1.5 font-semibold">문항</th>
                  <th scope="col" className="py-1.5 text-right font-semibold">합계</th>
                </tr>
              </thead>
              <tbody className="font-serif">
                {SCORE_TABLE.map((row) => (
                  <tr key={`${row.label}-${row.points}`} className="border-b border-dashed">
                    <td className="py-2">{row.label}</td>
                    <td className="py-2">{row.points}점</td>
                    <td className="py-2">{row.count}문항</td>
                    <td className="py-2 text-right font-bold">{row.points * row.count}점</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="flex-1 md:pl-8" aria-labelledby="bonus-title">
            <h2 id="bonus-title" className="font-serif text-lg font-bold">
              [가산점 안내]
            </h2>
            <ul className="mt-3 flex flex-col gap-3 text-sm leading-relaxed">
              <li>
                <strong className="font-serif font-bold">ㄱ. 빠른 정답</strong>
                <p className="text-muted-foreground">6초 이내에 정답을 제출하면 +1점</p>
              </li>
              <li>
                <strong className="font-serif font-bold">ㄴ. 연속 정답</strong>
                <p className="text-muted-foreground">
                  연속으로 맞힌 문항 수만큼 가산점 (2연속 +2, 3연속 +3, …). 오답 시 초기화
                </p>
              </li>
            </ul>
            <p className="mt-4 border-l-2 border-pen pl-3 text-xs leading-relaxed text-muted-foreground">
              두 가산점은 각각 따로 계산하여 합산합니다. 기본 점수가 100점이면 가산점은 적용되지
              않으며, 최종 점수는 100점을 넘지 않습니다.
            </p>
          </section>
        </div>

        <section className="mt-8 border border-foreground p-4 md:p-5" aria-labelledby="rules-title">
          <h2 id="rules-title" className="font-serif font-bold">
            ※ 유의 사항
          </h2>
          <ol className="mt-2 flex list-decimal flex-col gap-1.5 pl-5 text-sm leading-relaxed">
            {RULES.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ol>
        </section>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Button
            onClick={onStart}
            className="h-14 w-full gap-2 rounded-sm font-serif text-lg font-bold tracking-widest transition-transform hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto sm:px-14"
          >
            <PenLine className="size-5" aria-hidden="true" />
            시험 시작
          </Button>
          <p className="text-xs text-muted-foreground">
            {'시작 버튼을 누르면 1번 문항의 시간 측정이 시작됩니다.'}
          </p>
        </div>

        <p className="mt-10 text-center font-serif text-sm text-muted-foreground" aria-hidden="true">
          - 표지 -
        </p>
      </article>
    </main>
  )
}
