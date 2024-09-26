import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, X } from 'lucide-react'

interface GameResultProps {
  gameState: 'won' | 'lost'
  currentGame: 'RideTheBus' | 'TileHunter' | 'CasinoWar' | null
  betAmount: number
  gameData: { balance: number; highScore: number }
  resetGame: () => void
}

export default function GameResult({
  gameState,
  currentGame,
  betAmount,
  gameData,
  resetGame,
}: GameResultProps) {
  return (
    <Card className="bg-gradient-to-b from-purple-900 to-indigo-900 text-white shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-500" onClick={resetGame}>
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back to Setup</span>
          </Button>
          <h2 className="text-2xl font-bold text-yellow-400 shadow-text">{currentGame}</h2>
          <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-500">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="flex flex-col items-center mb-6">
          <h3 className="text-3xl font-bold mb-4 text-center">{gameState === "won" ? "You Won!" : "Game Over"}</h3>
          <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
            <span className="text-6xl">{gameState === "won" ? "🏆" : "😢"}</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {gameState === "won" 
              ? `+${betAmount} 🪙` 
              : `-${betAmount} 🪙`}
          </p>
        </div>
        <div className="space-y-2 mb-6">
          <p className="text-center">New Balance: {gameData.balance} 🪙</p>
          {gameState === "won" && betAmount > gameData.highScore && (
            <p className="text-center text-yellow-400 font-bold">New High Score!</p>
          )}
        </div>
        <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-full transition-all duration-200 shadow-lg" onClick={resetGame}>
          Play Again
        </Button>
      </CardContent>
    </Card>
  )
}