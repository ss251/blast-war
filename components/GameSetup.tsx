import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Home } from 'lucide-react'

interface GameSetupProps {
  currentGame: 'RideTheBus' | 'TileHunter' | 'CasinoWar' | null
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane'
  setDifficulty: (difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane') => void
  betAmount: number
  setBetAmount: (amount: number) => void
  gameData: { balance: number }
  handlePlay: () => void
  setGameState?: (state: 'launcher' | 'setup' | 'playing') => void // Make it optional
}

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Insane']

export default function GameSetup({
  currentGame,
  difficulty,
  setDifficulty,
  betAmount,
  setBetAmount,
  gameData,
  handlePlay,
  setGameState
}: GameSetupProps) {
  const handleHomeClick = () => {
    if (setGameState) {
      setGameState('launcher')
    } else {
      console.warn('setGameState function not provided to GameSetup')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-b from-purple-900 to-indigo-900 text-white shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-center text-yellow-400 shadow-text">
            {currentGame === 'RideTheBus' ? 'Ride The Bus' : 
             currentGame === 'TileHunter' ? 'Tile Hunter' : 'Casino War'}
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-yellow-400 hover:text-yellow-500" 
            onClick={handleHomeClick}
          >
            <Home className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg">Bet Amount</span>
          <span className="font-bold text-lg">BALANCE: 🪙 {gameData.balance}</span>
        </div>
        <Slider
          min={10}
          max={1000}
          step={10}
          value={[betAmount]}
          onValueChange={(value) => setBetAmount(value[0])}
          className="mb-4"
        />
        <div className="flex justify-between text-sm mb-6">
          <span>Min: 10</span>
          <span className="font-bold">{betAmount}</span>
          <button onClick={() => setBetAmount(1000)} className="text-yellow-400">Max</button>
        </div>
        <div className="mb-6">
          <h3 className="mb-2 text-lg">Difficulty</h3>
          <div className="grid grid-cols-2 gap-2">
            {DIFFICULTIES.map((diff) => (
              <Button
                key={diff}
                variant={difficulty === diff ? "default" : "outline"}
                onClick={() => setDifficulty(diff as 'Easy' | 'Medium' | 'Hard' | 'Insane')}
                className={`${difficulty === diff ? 'bg-yellow-500 text-black' : 'bg-transparent border-yellow-500 text-yellow-500'} hover:bg-yellow-600 hover:text-black transition-all duration-200`}
              >
                {diff}
              </Button>
            ))}
          </div>
        </div>
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-full transition-all duration-200 shadow-lg"
          onClick={handlePlay}
        >
          Play
        </Button>
        <p className="text-center text-yellow-400 mt-4 font-bold">MAX WIN: 32,000 TOKENS</p>
      </CardContent>
    </Card>
  )
}