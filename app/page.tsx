'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import GameLauncher from '@/components/GameLauncher'
import GameSetup from '@/components/GameSetup'
import GameResult from '@/components/GameResult'

const RideTheBus = dynamic(() => import('@/components/RideTheBus'), { ssr: false })
const TileHunter = dynamic(() => import('@/components/TileHunter'), { ssr: false })
const CasinoWar = dynamic(() => import('@/components/CasinoWar'), { ssr: false })

type GameState = 'launcher' | 'setup' | 'playing' | 'won' | 'lost'
type Game = 'RideTheBus' | 'TileHunter' | 'CasinoWar'
type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane'

interface GameData {
  balance: number
  highScore: number
}

const INITIAL_GAME_DATA: GameData = {
  balance: 1000,
  highScore: 0,
}

// Define a type for the Telegram WebApp object
interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
  // Add other methods and properties as needed
}

// Extend the Window interface to include Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export default function BlastWars() {
  const [gameState, setGameState] = useState<GameState>('launcher')
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy')
  const [betAmount, setBetAmount] = useState(250)
  const [gameData, setGameData] = useState<GameData>(INITIAL_GAME_DATA)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [tg, setTg] = useState<TelegramWebApp | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tgApp = window.Telegram.WebApp
      setTg(tgApp)
      tgApp.ready()
      tgApp.expand()

      tgApp.onEvent('viewportChanged', handleViewportChange)

      return () => {
        tgApp.offEvent('viewportChanged', handleViewportChange)
      }
    }
  }, [])

  const handleViewportChange = () => {
    console.log('Viewport changed', tg)
    // You can use the `tg` state here if needed
    // For example: tg?.someMethod()
  }

  const startGame = (game: Game) => {
    setCurrentGame(game)
    setGameState('setup')
  }

  const handlePlay = () => {
    if (gameData.balance < betAmount) {
      alert('Insufficient balance to place this bet!')
      return
    }
    setGameData((prev) => ({ ...prev, balance: prev.balance - betAmount }))
    setGameState('playing')
  }

  const updateBalance = (newBalance: number) => {
    setGameData((prev) => ({ 
      ...prev, 
      balance: newBalance,
      highScore: Math.max(prev.highScore, newBalance)
    }))
  }

  const resetGame = () => {
    setGameState('setup')
  }

  const renderGame = () => {
    switch (gameState) {
      case 'launcher':
        return <GameLauncher startGame={startGame} gameData={gameData} />
      case 'setup':
        return (
          <GameSetup
            currentGame={currentGame}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            gameData={gameData}
            handlePlay={handlePlay}
          />
        )
      case 'playing':
        switch (currentGame) {
          case 'RideTheBus':
            return (
              <RideTheBus
                difficulty={difficulty}
                betAmount={betAmount}
                gameData={gameData}
                updateBalance={updateBalance}
                setGameState={setGameState}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
              />
            )
          case 'TileHunter':
            return (
              <TileHunter
                difficulty={difficulty}
                betAmount={betAmount}
                gameData={gameData}
                updateBalance={updateBalance}
                setGameState={setGameState}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
              />
            )
          case 'CasinoWar':
            return (
              <CasinoWar
                betAmount={betAmount}
                gameData={gameData}
                updateBalance={updateBalance}
                setGameState={setGameState}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
              />
            )
          default:
            return <div>Error: Invalid game selected</div>
        }
      case 'won':
      case 'lost':
        return (
          <GameResult
            gameState={gameState}
            currentGame={currentGame}
            betAmount={betAmount}
            gameData={gameData}
            resetGame={resetGame}
          />
        )
      default:
        return <div>Error: Invalid game state</div>
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {renderGame()}
    </div>
  )
}