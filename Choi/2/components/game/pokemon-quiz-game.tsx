'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useQuizGame } from '@/hooks/use-quiz-game'
import type { QuizQuestion } from '@/lib/quiz-data'
import { TopBar } from './top-bar'
import { StartScreen } from './start-screen'
import { QuestionCard } from './question-card'
import { RewardPopup } from './reward-popup'
import { ResultScreen } from './result-screen'
import { PokedexView } from './pokedex'
import { PokeBall } from './shared'

export function PokemonQuizGame() {
  const game = useQuizGame()
  const [pokedexOpen, setPokedexOpen] = useState(false)
  const [reward, setReward] = useState<QuizQuestion | null>(null)
  const [rewardOpen, setRewardOpen] = useState(false)

  if (!game.hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center" role="status">
        <PokeBall className="size-14 animate-spin" />
        <span className="sr-only">불러오는 중</span>
      </div>
    )
  }

  const handleAnswer = (originalIndex: number) => {
    const q = game.currentQuestion
    if (!q || game.currentAnswer) return
    game.submitAnswer(q.id, originalIndex)
    if (q.answer === originalIndex) {
      setReward(q)
      window.setTimeout(() => setRewardOpen(true), 900)
    }
  }

  const handleRestart = () => {
    setRewardOpen(false)
    game.resetToStart()
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar
        points={game.points}
        currentIndex={game.currentIndex}
        total={game.total}
        answeredCount={game.stats.answered}
        collectedCount={game.collectedIds.size}
        showProgress={game.phase === 'playing'}
        onOpenPokedex={() => setPokedexOpen(true)}
      />

      <main className="flex-1">
        {game.phase === 'start' && (
          <StartScreen
            defaultShuffle={game.shuffle}
            defaultMode={game.mode}
            loading={game.loading}
            error={game.error}
            onStart={game.startGame}
          />
        )}

        {game.phase === 'playing' && game.currentQuestion && (
          <>
            <QuestionCard
              question={game.currentQuestion}
              answer={game.currentAnswer}
              questionNumber={game.currentIndex + 1}
              total={game.total}
              onAnswer={handleAnswer}
              onNext={game.nextQuestion}
            />
            <div className="mx-auto flex max-w-3xl justify-center px-4 pb-8">
              <Button
                variant="ghost"
                onClick={handleRestart}
                className="rounded-full text-sm font-bold text-blue-700 hover:bg-blue-100"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                처음부터 다시 시작
              </Button>
            </div>
          </>
        )}

        {game.phase === 'result' && (
          <ResultScreen
            correct={game.stats.correct}
            wrong={game.stats.wrong}
            total={game.total}
            points={game.points}
            questions={game.questions}
            collectedIds={game.collectedIds}
            answers={game.answers}
            onRestart={handleRestart}
          />
        )}
      </main>

      <RewardPopup question={reward} open={rewardOpen} onOpenChange={setRewardOpen} />

      <Dialog open={pokedexOpen} onOpenChange={setPokedexOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-[2rem] border-4 border-blue-800 bg-sky-50 sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-blue-800">포켓몬 도감</DialogTitle>
            <DialogDescription>
              문제를 맞혀 획득한 포켓몬과 아이템이 등록됩니다. 총 {game.questions.length}종을 모아 보세요!
            </DialogDescription>
          </DialogHeader>
          <PokedexView questions={game.questions} collectedIds={game.collectedIds} answers={game.answers} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
