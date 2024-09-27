import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface GameLauncherProps {
  startGame: (game: 'RideTheBus' | 'TileHunter' | 'CasinoWar') => void
  gameData: { balance: number; highScore: number }
}

export default function GameLauncher({ startGame, gameData }: GameLauncherProps) {
  return (
    <Card className="bg-gradient-to-b from-purple-900 to-indigo-900 text-white shadow-xl rounded-3xl overflow-hidden flex flex-col">
      <CardContent className="p-6 flex flex-col flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400 shadow-text">Blast Wars</h1>
        <div className="space-y-4 flex-grow flex flex-col justify-center">
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg"
            onClick={() => startGame('RideTheBus')}
          >
            Ride The Bus
          </Button>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg"
            onClick={() => startGame('TileHunter')}
          >
            Tile Hunter
          </Button>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg"
            onClick={() => startGame('CasinoWar')}
          >
            Casino War
          </Button>
        </div>
        <div className="mt-auto">
          <p className="text-center text-purple-400 mt-6 font-bold">Balance: {gameData.balance} 🪙</p>
          <p className="text-center text-green-400 mt-2">High Score: {gameData.highScore}</p>
        </div>
      </CardContent>
    </Card>
  )
}