import type { Question } from './questions'

export const TOTAL_QUESTIONS = 20
export const MAX_SCORE = 100
export const FAST_LIMIT_MS = 6000

export type AnswerRecord = {
  questionId: number
  response: string
  correct: boolean
  elapsedMs: number
  earnedPoints: number
  fast: boolean
  streakCount: number
  fastBonus: number
  streakBonus: number
  bonus: number
}

export const FAST_BONUS = 1
export const MIN_STREAK = 2

export function streakBonusFor(streakCount: number) {
  return streakCount >= MIN_STREAK ? streakCount : 0
}

export function normalizeAnswer(value: string) {
  return value.replace(/\s+/g, '')
}

const NUMERIC = /^[-+]?(\d+\.?\d*|\.\d+)$/

export function isShortAnswerCorrect(input: string, answer: string) {
  const given = normalizeAnswer(input)
  const expected = normalizeAnswer(answer)
  if (!given) return false
  if (given === expected) return true
  return NUMERIC.test(given) && NUMERIC.test(expected) && Number(given) === Number(expected)
}

export function gradeResponse(question: Question, response: string) {
  if (question.type === 'mc') return Number(response) === question.answerIndex
  return isShortAnswerCorrect(response, question.answer)
}

export function evaluateSubmission(params: {
  question: Question
  response: string
  elapsedMs: number
  previousStreak: number
}): AnswerRecord {
  const { question, response, elapsedMs, previousStreak } = params
  const correct = gradeResponse(question, response)
  const fast = correct && elapsedMs <= FAST_LIMIT_MS
  const streakCount = correct ? previousStreak + 1 : 0
  const fastBonus = fast ? FAST_BONUS : 0
  const streakBonus = streakBonusFor(streakCount)
  return {
    questionId: question.id,
    response,
    correct,
    elapsedMs,
    earnedPoints: correct ? question.points : 0,
    fast,
    streakCount,
    fastBonus,
    streakBonus,
    bonus: fastBonus + streakBonus,
  }
}

export function computeFinalScore(baseScore: number, earnedBonus: number) {
  const appliedBonus =
    baseScore >= MAX_SCORE ? 0 : Math.min(earnedBonus, MAX_SCORE - baseScore)
  return {
    appliedBonus,
    finalScore: Math.min(MAX_SCORE, baseScore + appliedBonus),
  }
}

export function summarize(records: AnswerRecord[]) {
  const baseScore = records.reduce((sum, r) => sum + r.earnedPoints, 0)
  const fastBonus = records.reduce((sum, r) => sum + r.fastBonus, 0)
  const streakBonus = records.reduce((sum, r) => sum + r.streakBonus, 0)
  const earnedBonus = fastBonus + streakBonus
  const correctCount = records.filter((r) => r.correct).length
  const fastCount = records.filter((r) => r.fast).length

  let maxStreak = 0
  let run = 0
  for (const r of records) {
    run = r.correct ? run + 1 : 0
    maxStreak = Math.max(maxStreak, run)
  }

  const { appliedBonus, finalScore } = computeFinalScore(baseScore, earnedBonus)

  return {
    baseScore,
    fastBonus,
    streakBonus,
    earnedBonus,
    appliedBonus,
    finalScore,
    correctCount,
    wrongCount: records.length - correctCount,
    accuracy: records.length ? Math.round((correctCount / records.length) * 1000) / 10 : 0,
    fastCount,
    maxStreak,
    currentStreak: run,
  }
}

export function gradeMessage(score: number) {
  if (score >= 90) return '완벽에 가까운 실력입니다!'
  if (score >= 80) return '훌륭합니다!'
  if (score >= 70) return '좋은 성적입니다!'
  if (score >= 60) return '조금만 더 노력해 보세요!'
  return '복습을 통해 실력을 키워 봅시다!'
}

export function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`
}

export function formatSeconds(ms: number) {
  return `${(ms / 1000).toFixed(1)}초`
}
