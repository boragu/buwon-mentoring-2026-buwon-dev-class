'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { QUIZ_QUESTIONS, type QuizQuestion } from '@/lib/quiz-data'
import { RARITY } from '@/lib/game-config'

const STORAGE_KEY = 'pokemon-master-quiz:v2'

export type Phase = 'start' | 'playing' | 'result'
export type GameMode = 'classic' | 'random'

export interface AnswerRecord {
  selected: number
  correct: boolean
  points: number
}

interface GameState {
  phase: Phase
  mode: GameMode
  questions: QuizQuestion[]
  order: string[]
  optionOrders: Record<string, number[]>
  currentIndex: number
  answers: Record<string, AnswerRecord>
  points: number
  shuffle: boolean
}

function shuffleArray<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function createInitialState(shuffle = true, mode: GameMode = 'classic'): GameState {
  return {
    phase: 'start',
    mode,
    questions: QUIZ_QUESTIONS,
    order: QUIZ_QUESTIONS.map((q) => q.id),
    optionOrders: {},
    currentIndex: 0,
    answers: {},
    points: 0,
    shuffle,
  }
}

function isValidState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false
  const s = value as GameState
  return (
    (s.mode === 'classic' || s.mode === 'random') &&
    Array.isArray(s.questions) &&
    s.questions.length > 0 &&
    Array.isArray(s.order) &&
    s.order.length === s.questions.length &&
    typeof s.currentIndex === 'number' &&
    typeof s.points === 'number' &&
    typeof s.answers === 'object'
  )
}

async function fetchRandomQuestions(): Promise<QuizQuestion[]> {
  const res = await fetch('/api/random-quiz', { cache: 'no-store' })
  const data = (await res.json()) as { questions?: QuizQuestion[]; error?: string }
  if (!res.ok || !data.questions) throw new Error(data.error ?? '문제를 불러오지 못했어요.')
  return data.questions
}

export interface DisplayQuestion extends QuizQuestion {
  displayOptions: { text: string; originalIndex: number }[]
}

export function useQuizGame() {
  const [state, setState] = useState<GameState>(() => createInitialState())
  const [hydrated, setHydrated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (isValidState(parsed)) setState(parsed)
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, hydrated])

  const questionById = useMemo(() => new Map(state.questions.map((q) => [q.id, q])), [state.questions])

  const startGame = useCallback(async (shuffle: boolean, mode: GameMode) => {
    setError(null)
    let questions = QUIZ_QUESTIONS
    if (mode === 'random') {
      setLoading(true)
      try {
        questions = await fetchRandomQuestions()
      } catch (e) {
        setError(e instanceof Error ? e.message : '문제를 불러오지 못했어요.')
        return
      } finally {
        setLoading(false)
      }
    }
    const ids = questions.map((q) => q.id)
    const optionOrders: Record<string, number[]> = {}
    for (const id of ids) {
      optionOrders[id] = shuffle ? shuffleArray([0, 1, 2, 3]) : [0, 1, 2, 3]
    }
    setState({
      ...createInitialState(shuffle, mode),
      phase: 'playing',
      questions,
      order: shuffle ? shuffleArray(ids) : ids,
      optionOrders,
    })
  }, [])

  const resetToStart = useCallback(() => {
    setError(null)
    setState((prev) => createInitialState(prev.shuffle, prev.mode))
  }, [])

  const currentQuestion: DisplayQuestion | null = useMemo(() => {
    const id = state.order[state.currentIndex]
    const q = id ? questionById.get(id) : undefined
    if (!q) return null
    const order = state.optionOrders[q.id] ?? [0, 1, 2, 3]
    return {
      ...q,
      displayOptions: order.map((originalIndex) => ({
        text: q.options[originalIndex],
        originalIndex,
      })),
    }
  }, [state.order, state.currentIndex, state.optionOrders, questionById])

  const currentAnswer = currentQuestion ? state.answers[currentQuestion.id] : undefined

  const submitAnswer = useCallback((questionId: string, originalIndex: number) => {
    setState((prev) => {
      if (prev.answers[questionId]) return prev
      const q = prev.questions.find((item) => item.id === questionId)
      if (!q) return prev
      const correct = q.answer === originalIndex
      const points = correct ? RARITY[q.rarity].points : 0
      return {
        ...prev,
        answers: { ...prev.answers, [questionId]: { selected: originalIndex, correct, points } },
        points: prev.points + points,
      }
    })
  }, [])

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const id = prev.order[prev.currentIndex]
      if (!id || !prev.answers[id]) return prev
      if (prev.currentIndex >= prev.order.length - 1) return { ...prev, phase: 'result' }
      return { ...prev, currentIndex: prev.currentIndex + 1 }
    })
  }, [])

  const stats = useMemo(() => {
    const records = Object.values(state.answers)
    const correct = records.filter((r) => r.correct).length
    return {
      answered: records.length,
      correct,
      wrong: records.length - correct,
    }
  }, [state.answers])

  const collectedIds = useMemo(
    () => new Set(Object.entries(state.answers).filter(([, r]) => r.correct).map(([id]) => id)),
    [state.answers],
  )

  return {
    hydrated,
    loading,
    error,
    phase: state.phase,
    mode: state.mode,
    questions: state.questions,
    shuffle: state.shuffle,
    points: state.points,
    currentIndex: state.currentIndex,
    total: state.order.length,
    answers: state.answers,
    currentQuestion,
    currentAnswer,
    stats,
    collectedIds,
    startGame,
    resetToStart,
    submitAnswer,
    nextQuestion,
  }
}
