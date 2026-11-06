import assert from 'node:assert/strict'
import { QUESTIONS } from '../lib/exam/questions'
import {
  computeFinalScore,
  evaluateSubmission,
  isShortAnswerCorrect,
  summarize,
} from '../lib/exam/scoring'
import { validateQuestions } from '../lib/exam/validate'

const errors = validateQuestions()
assert.deepEqual(errors, [], errors.join('\n'))

assert.equal(QUESTIONS.filter((q) => q.type === 'mc').length, 15)
assert.equal(QUESTIONS.filter((q) => q.type === 'short').length, 5)

const q1 = QUESTIONS[0]
const q2 = QUESTIONS[1]
const correctOf = (q: (typeof QUESTIONS)[number]) =>
  q.type === 'mc' ? String(q.answerIndex) : q.answer

const fast = evaluateSubmission({ question: q1, response: correctOf(q1), elapsedMs: 5900, previousStreak: 0 })
assert.deepEqual([fast.fastBonus, fast.streakBonus, fast.bonus], [1, 0, 1], '빠른 정답 +1')

const slow = evaluateSubmission({ question: q1, response: correctOf(q1), elapsedMs: 9000, previousStreak: 0 })
assert.equal(slow.bonus, 0, '느린 첫 정답 보너스 없음')

const streak2 = evaluateSubmission({ question: q2, response: correctOf(q2), elapsedMs: 9000, previousStreak: 1 })
assert.deepEqual([streak2.streakCount, streak2.streakBonus, streak2.bonus], [2, 2, 2], '2연속 +2')

const streak5 = evaluateSubmission({ question: q2, response: correctOf(q2), elapsedMs: 9000, previousStreak: 4 })
assert.equal(streak5.streakBonus, 5, '5연속 +5')

const both = evaluateSubmission({ question: q2, response: correctOf(q2), elapsedMs: 1000, previousStreak: 2 })
assert.deepEqual([both.fastBonus, both.streakBonus, both.bonus], [1, 3, 4], '빠른+연속 별도 합산')

const wrong = evaluateSubmission({ question: q2, response: '0', elapsedMs: 1000, previousStreak: 5 })
assert.deepEqual([wrong.streakCount, wrong.bonus], [0, 0], '오답은 연속 초기화, 보너스 없음')

assert.ok(isShortAnswerCorrect(' 5 2 ', '52'))
assert.ok(!isShortAnswerCorrect('', '52'))
assert.ok(!isShortAnswerCorrect('53', '52'))

assert.deepEqual(computeFinalScore(80, 5), { appliedBonus: 5, finalScore: 85 })
assert.deepEqual(computeFinalScore(95, 5), { appliedBonus: 5, finalScore: 100 })
assert.deepEqual(computeFinalScore(100, 19), { appliedBonus: 0, finalScore: 100 })

let prev = 0
const perfect = QUESTIONS.map((q) => {
  const r = evaluateSubmission({ question: q, response: correctOf(q), elapsedMs: 1000, previousStreak: prev })
  prev = r.streakCount
  return r
})
const summary = summarize(perfect)
assert.equal(summary.baseScore, 100)
assert.equal(summary.fastBonus, 20)
assert.equal(summary.streakBonus, 209)
assert.equal(summary.finalScore, 100)
assert.equal(summary.appliedBonus, 0)
assert.equal(summary.maxStreak, 20)

console.log('All exam checks passed')
