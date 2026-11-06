import { QUESTIONS, type Question } from './questions'
import { MAX_SCORE, TOTAL_QUESTIONS } from './scoring'

const EPSILON = 1e-4

const approxEqual = (a: number, b: number) =>
  Math.abs(a - b) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b))

export function validateQuestions(questions: Question[] = QUESTIONS) {
  const errors: string[] = []
  const mc = questions.filter((q) => q.type === 'mc')
  const short = questions.filter((q) => q.type === 'short')
  const countPoints = (p: number) => mc.filter((q) => q.points === p).length

  if (questions.length !== TOTAL_QUESTIONS) errors.push(`문제 수 ${questions.length} ≠ 20`)
  if (mc.length !== 15) errors.push(`객관식 ${mc.length} ≠ 15`)
  if (short.length !== 5) errors.push(`주관식 ${short.length} ≠ 5`)
  if (countPoints(3) !== 4) errors.push('3점 객관식은 4문제여야 합니다')
  if (countPoints(4) !== 7) errors.push('4점 객관식은 7문제여야 합니다')
  if (countPoints(5) !== 4) errors.push('5점 객관식은 4문제여야 합니다')
  if (short.some((q) => q.points !== 8)) errors.push('주관식은 모두 8점이어야 합니다')

  const total = questions.reduce((sum, q) => sum + q.points, 0)
  if (total !== MAX_SCORE) errors.push(`총점 ${total} ≠ 100`)

  for (const q of questions) {
    const expected = q.verify()
    if (q.type === 'mc') {
      if (q.choices.length !== 5) errors.push(`${q.id}번: 선택지는 5개여야 합니다`)
      const matching = q.choices
        .map((c, i) => (approxEqual(c.value, expected) ? i : -1))
        .filter((i) => i >= 0)
      if (matching.length !== 1) {
        errors.push(`${q.id}번: 정답 선택지가 정확히 1개가 아닙니다 (${matching.length}개)`)
      } else if (matching[0] !== q.answerIndex) {
        errors.push(`${q.id}번: 정답 번호 불일치 (계산 ${matching[0] + 1}, 저장 ${q.answerIndex + 1})`)
      }
    } else if (!approxEqual(Number(q.answer), expected)) {
      errors.push(`${q.id}번: 정답 불일치 (계산 ${expected}, 저장 ${q.answer})`)
    }
  }

  return errors
}
