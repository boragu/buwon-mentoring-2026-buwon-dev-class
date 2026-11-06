import { cn } from '@/lib/utils'

export function GradeMark({
  correct,
  className,
  strokeWidth = 6,
}: {
  correct: boolean
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={cn('pointer-events-none text-pen', className)}
    >
      {correct ? (
        <path
          className="grade-stroke"
          pathLength={1}
          d="M58 8 C 22 4, 4 32, 10 60 C 16 88, 60 98, 84 76 C 102 58, 94 18, 62 10 C 52 8, 44 10, 40 12"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ) : (
        <path
          className="grade-stroke"
          pathLength={1}
          d="M88 8 L 12 92"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
