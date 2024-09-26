import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Volume2, VolumeX } from 'lucide-react'

interface TileHunterProps {
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane'
  betAmount: number
  gameData: { balance: number }
  updateBalance: (newBalance: number) => void
  setGameState: (state: 'won' | 'lost' | 'setup') => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
}

const GRID_SIZES = {
  Easy: 25,
  Medium: 36,
  Hard: 49,
  Insane: 64
}

export default function TileHunter({
  difficulty,
  betAmount,
  gameData,
  updateBalance,
  setGameState,
  soundEnabled,
  setSoundEnabled,
}: TileHunterProps) {
  const gridSize = GRID_SIZES[difficulty]
  const [revealedTiles, setRevealedTiles] = useState<number[]>([])
  const [safeTiles, setSafeTiles] = useState<number[]>([])
  const [multiplier, setMultiplier] = useState(1)

  useEffect(() => {
    const safeCount = Math.floor(gridSize * 0.4)
    const newSafeTiles: number[] = []
    while (newSafeTiles.length < safeCount) {
      const tile = Math.floor(Math.random() * gridSize)
      if (!newSafeTiles.includes(tile)) {
        newSafeTiles.push(tile)
      }
    }
    setSafeTiles(newSafeTiles)
  }, [gridSize])

  const playSound = (soundName: string) => {
    if (soundEnabled) {
      const audio = new Audio(`/sounds/${soundName}.mp3`)
      audio.play()
    }
  }

  const handleTileReveal = (index: number) => {
    if (revealedTiles.includes(index)) return

    setRevealedTiles((prev) => [...prev, index])

    if (safeTiles.includes(index)) {
      playSound('correct')
      const newMultiplier = multiplier + 0.1
      setMultiplier(newMultiplier)

      if (revealedTiles.length + 1 === safeTiles.length) {
        const winnings = betAmount * newMultiplier
        updateBalance(gameData.balance + winnings)
        setTimeout(() => setGameState('won'), 1000)
      }
    } else {
      playSound('wrong')
      setTimeout(() => setGameState('lost'), 1000)
    }
  }

  const handleCashout = () => {
    const winnings = betAmount * multiplier
    updateBalance(gameData.balance + winnings)
    setGameState('won')
    playSound('cashout')
  }

  return (
    <Card className="bg-gradient-to-b from-purple-900 to-indigo-900 text-white shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-500" onClick={() => setGameState('setup')}>
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
          <h2 className="text-2xl font-bold text-yellow-400 shadow-text">Tile Hunter</h2>
          <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-500" onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>
        </div>
        <div className="flex justify-between mb-4 text-sm">
          <span>Bet: {betAmount} 🪙</span>
          <span className="text-green-400">Difficulty: {difficulty}</span>
        </div>
        <p className="text-center text-yellow-400 mb-4 text-xl font-bold">MULTIPLIER - {multiplier.toFixed(2)}x</p>
        <div className={`grid gap-2 mb-4 ${
          gridSize === 25 ? 'grid-cols-5' : 
          gridSize === 36 ? 'grid-cols-6' : 
          gridSize === 49 ? 'grid-cols-7' : 
          'grid-cols-8'
        }`}>
          {Array.from({ length: gridSize }).map((_, index) => (
            <Button
              key={index}
              className={`w-full aspect-square rounded-lg ${
                revealedTiles.includes(index)
                  ? safeTiles.includes(index)
                    ? 'bg-green-600'
                    : 'bg-red-600'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              onClick={() => handleTileReveal(index)}
              disabled={revealedTiles.includes(index)}
            >
              {revealedTiles.includes(index) && safeTiles.includes(index) && '✓'}
            </Button>
          ))}
        </div>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg"
          onClick={handleCashout}
        >
          Cashout - {multiplier.toFixed(2)}x
        </Button>
      </CardContent>
    </Card>
  )
}