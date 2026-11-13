'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { RARITY } from '@/lib/game-config'
import type { QuizQuestion } from '@/lib/quiz-data'
import { cn } from '@/lib/utils'
import { ItemCard, PokemonArtwork, RarityBadge, TypeBadge } from './shared'

export function RewardPopup({
  question,
  open,
  onOpenChange,
}: {
  question: QuizQuestion | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!question) return null
  const info = RARITY[question.rarity]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-[2rem] border-4 border-blue-800 bg-white p-0 sm:max-w-sm">
        <div className={cn('relative flex flex-col items-center bg-gradient-to-b px-6 pt-6 pb-4', info.cardClass)}>
          <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.8)_20deg,transparent_40deg,transparent_90deg,rgba(255,255,255,0.8)_110deg,transparent_130deg,transparent_180deg,rgba(255,255,255,0.8)_200deg,transparent_220deg,transparent_270deg,rgba(255,255,255,0.8)_290deg,transparent_310deg)] opacity-60" />
          <p className="relative font-display text-sm tracking-widest text-blue-800">NEW!</p>
          <DialogTitle className="relative font-display text-2xl text-blue-800">아이템 획득!</DialogTitle>
          <PokemonArtwork
            artworkId={question.pokemon.artworkId}
            name={question.pokemon.name}
            className="relative size-40 animate-reveal"
          />
          <div className="relative flex items-center gap-2">
            <p className="font-display text-xl text-slate-900">{question.pokemon.name}</p>
            <RarityBadge rarity={question.rarity} />
          </div>
          <div className="relative mt-1 flex gap-1">
            {question.pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 px-5 pb-5">
          <DialogDescription className="text-center text-sm text-slate-600">
            {question.pokemon.name}이(가) 도감에 등록되었습니다.
          </DialogDescription>
          <ItemCard question={question} />
          <p className="text-center font-display text-2xl text-amber-500 [text-shadow:2px_2px_0_#1e3a8a]">
            +{info.points} PT
          </p>
          <Button
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-full bg-yellow-400 font-display text-base text-blue-900 shadow-[0_4px_0_#b45309] hover:bg-yellow-300"
          >
            좋아!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
