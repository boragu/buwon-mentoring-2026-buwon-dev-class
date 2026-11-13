import type { Difficulty, Rarity } from './quiz-data'

export interface RarityInfo {
  label: string
  english: string
  symbol: string
  points: number
  cardClass: string
  badgeClass: string
  glowClass: string
}

export const RARITY: Record<Rarity, RarityInfo> = {
  common: {
    label: '일반',
    english: 'Common',
    symbol: '⚪',
    points: 10,
    cardClass: 'from-slate-50 to-slate-200 border-slate-300',
    badgeClass: 'bg-slate-200 text-slate-800',
    glowClass: 'shadow-slate-300/60',
  },
  rare: {
    label: '희귀',
    english: 'Rare',
    symbol: '🔵',
    points: 20,
    cardClass: 'from-sky-50 to-sky-200 border-sky-400',
    badgeClass: 'bg-sky-500 text-white',
    glowClass: 'shadow-sky-400/60',
  },
  special: {
    label: '특별',
    english: 'Special',
    symbol: '🟣',
    points: 30,
    cardClass: 'from-violet-50 to-violet-200 border-violet-400',
    badgeClass: 'bg-violet-500 text-white',
    glowClass: 'shadow-violet-400/60',
  },
  legendary: {
    label: '전설',
    english: 'Legendary',
    symbol: '🟡',
    points: 50,
    cardClass: 'from-amber-50 to-amber-200 border-amber-400',
    badgeClass: 'bg-amber-400 text-amber-950',
    glowClass: 'shadow-amber-400/70',
  },
  mythical: {
    label: '환상',
    english: 'Mythical',
    symbol: '🌈',
    points: 70,
    cardClass: 'from-pink-100 via-sky-100 to-lime-100 border-pink-300',
    badgeClass: 'bg-gradient-to-r from-pink-500 via-amber-400 to-sky-500 text-white',
    glowClass: 'shadow-pink-400/60',
  },
  mega: {
    label: '메가진화',
    english: 'Mega Evolution',
    symbol: '🔥',
    points: 60,
    cardClass: 'from-orange-50 to-rose-200 border-orange-400',
    badgeClass: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white',
    glowClass: 'shadow-orange-400/70',
  },
  primal: {
    label: '원시회귀',
    english: 'Primal Reversion',
    symbol: '🌋',
    points: 80,
    cardClass: 'from-red-100 to-indigo-200 border-red-500',
    badgeClass: 'bg-gradient-to-r from-red-600 to-indigo-600 text-white',
    glowClass: 'shadow-red-500/70',
  },
}

export const DIFFICULTY: Record<Difficulty, { label: string; className: string }> = {
  easy: { label: '쉬움', className: 'bg-emerald-100 text-emerald-800' },
  normal: { label: '보통', className: 'bg-sky-100 text-sky-800' },
  hard: { label: '어려움', className: 'bg-rose-100 text-rose-800' },
}

export const TYPE_COLORS: Record<string, string> = {
  노말: 'bg-stone-400 text-white',
  불꽃: 'bg-orange-500 text-white',
  물: 'bg-blue-500 text-white',
  풀: 'bg-green-500 text-white',
  전기: 'bg-yellow-400 text-yellow-950',
  얼음: 'bg-cyan-300 text-cyan-950',
  격투: 'bg-red-700 text-white',
  독: 'bg-purple-500 text-white',
  땅: 'bg-amber-600 text-white',
  비행: 'bg-indigo-300 text-indigo-950',
  에스퍼: 'bg-pink-500 text-white',
  벌레: 'bg-lime-500 text-lime-950',
  바위: 'bg-yellow-700 text-white',
  고스트: 'bg-violet-700 text-white',
  드래곤: 'bg-indigo-600 text-white',
  악: 'bg-stone-700 text-white',
  강철: 'bg-slate-400 text-white',
  페어리: 'bg-pink-300 text-pink-950',
}

export function getPlayerRank(correct: number) {
  if (correct >= 25) return { title: '포켓몬 레전드', className: 'from-pink-500 via-amber-400 to-sky-500' }
  if (correct >= 21) return { title: '포켓몬 마스터', className: 'from-amber-400 to-orange-500' }
  if (correct >= 16) return { title: '포켓몬 챔피언', className: 'from-violet-500 to-indigo-600' }
  if (correct >= 11) return { title: '포켓몬 전문가', className: 'from-sky-500 to-blue-600' }
  if (correct >= 6) return { title: '포켓몬 트레이너', className: 'from-emerald-500 to-teal-600' }
  return { title: '포켓몬 초보', className: 'from-slate-400 to-slate-600' }
}

const PT_PER_LEVEL = 100

export function getLevel(points: number) {
  const level = Math.floor(points / PT_PER_LEVEL) + 1
  const progress = ((points % PT_PER_LEVEL) / PT_PER_LEVEL) * 100
  return { level, progress, toNext: PT_PER_LEVEL - (points % PT_PER_LEVEL) }
}
