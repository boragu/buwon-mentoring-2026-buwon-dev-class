'use client'

import { useCallback, useEffect, useReducer, useState } from 'react'
import { QUESTIONS } from './questions'
import { evaluateSubmission, type AnswerRecord } from './scoring'

const STORAGE_KEY = 'math-exam-state-v2'

export type ExamState = {
  status: 'intro' | 'running' | 'finished'
  current: number
  records: AnswerRecord[]
  examStartedAt: number
  questionStartedAt: number
  finishedAt: number
}

type Action =
  | { type: 'start'; now: number }
  | { type: 'submit'; index: number; response: string; now: number }
  | { type: 'next'; now: number }
  | { type: 'reset' }
  | { type: 'load'; state: ExamState }

const initialState: ExamState = {
  status: 'intro',
  current: 0,
  records: [],
  examStartedAt: 0,
  questionStartedAt: 0,
  finishedAt: 0,
}

function reducer(state: ExamState, action: Action): ExamState {
  switch (action.type) {
    case 'start':
      if (state.status !== 'intro') return state
      return {
        ...initialState,
        status: 'running',
        examStartedAt: action.now,
        questionStartedAt: action.now,
      }
    case 'submit': {
      if (state.status !== 'running') return state
      if (action.index !== state.current || state.records.length !== state.current) return state
      const question = QUESTIONS[state.current]
      const record = evaluateSubmission({
        question,
        response: action.response,
        elapsedMs: Math.max(0, action.now - state.questionStartedAt),
        previousStreak: state.records[state.current - 1]?.streakCount ?? 0,
      })
      const records = [...state.records, record]
      return {
        ...state,
        records,
        finishedAt: records.length === QUESTIONS.length ? action.now : state.finishedAt,
      }
    }
    case 'next':
      if (state.status !== 'running' || state.records.length !== state.current + 1) return state
      if (state.current === QUESTIONS.length - 1) return { ...state, status: 'finished' }
      return { ...state, current: state.current + 1, questionStartedAt: action.now }
    case 'reset':
      return initialState
    case 'load':
      return action.state
  }
}

function isExamState(value: unknown): value is ExamState {
  if (!value || typeof value !== 'object') return false
  const v = value as ExamState
  return (
    ['intro', 'running', 'finished'].includes(v.status) &&
    Number.isInteger(v.current) &&
    v.current >= 0 &&
    v.current < QUESTIONS.length &&
    Array.isArray(v.records) &&
    v.records.length <= QUESTIONS.length &&
    v.records.every((r) => typeof r?.streakCount === 'number' && typeof r?.fastBonus === 'number') &&
    (v.records.length === v.current || v.records.length === v.current + 1)
  )
}

export function useExam() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (isExamState(parsed)) dispatch({ type: 'load', state: parsed })
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, hydrated])

  const start = useCallback(() => dispatch({ type: 'start', now: Date.now() }), [])
  const submit = useCallback(
    (index: number, response: string) =>
      dispatch({ type: 'submit', index, response, now: Date.now() }),
    [],
  )
  const next = useCallback(() => dispatch({ type: 'next', now: Date.now() }), [])
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  return { state, hydrated, start, submit, next, reset }
}
