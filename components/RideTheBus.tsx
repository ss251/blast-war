import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Volume2, VolumeX, Home } from 'lucide-react'

type Round = 'Red or Black' | 'High or Low' | 'Inside Or Outside' | 'Suit' | 'Number'
const ROUNDS: Round[] = ['Red or Black', 'High or Low', 'Inside Or Outside', 'Suit', 'Number']
const SUITS = ['♠', '♥', '♦', '♣']
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

interface GameCard {
  suit: string
  value: string
  revealed: boolean
}

interface RideTheBusProps {
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane'
  betAmount: number
  gameData: { balance: number }
  updateBalance: (newBalance: number) => void
  setGameState: (state: 'won' | 'lost' | 'setup' | 'launcher') => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
}

export default function RideTheBus({
  difficulty,
  betAmount,
  gameData,
  updateBalance,
  setGameState,
  soundEnabled,
  setSoundEnabled,
}: RideTheBusProps) {
  const [currentRound, setCurrentRound] = useState(0)
  const [cards, setCards] = useState<GameCard[]>([])
  const [multiplier, setMultiplier] = useState(1)

  useEffect(() => {
    const newCards: GameCard[] = []
    for (let i = 0; i < 5; i++) {
      newCards.push({
        suit: SUITS[Math.floor(Math.random() * SUITS.length)],
        value: VALUES[Math.floor(Math.random() * VALUES.length)],
        revealed: false,
      })
    }
    setCards(newCards)
  }, [])

  const playSound = (soundName: string) => {
    if (soundEnabled) {
      const audio = new Audio(`/sounds/${soundName}.mp3`)
      audio.play()
    }
  }

  const handleGuess = (guess: string) => {
    let correct = false
    const card = cards[currentRound]

    switch (currentRound) {
      case 0: // Red or Black
        correct = (guess === 'Red' && (card.suit === '♥' || card.suit === '♦')) ||
                 (guess === 'Black' && (card.suit === '♠' || card.suit === '♣'))
        break
      case 1: // High or Low
        const prevValue = VALUES.indexOf(cards[currentRound - 1].value)
        const currentValue = VALUES.indexOf(card.value)
        correct = (guess === 'High' && currentValue > prevValue) ||
                 (guess === 'Low' && currentValue < prevValue)
        break
      case 2: // Inside or Outside
        const lowestValue = Math.min(VALUES.indexOf(cards[0].value), VALUES.indexOf(cards[1].value))
        const highestValue = Math.max(VALUES.indexOf(cards[0].value), VALUES.indexOf(cards[1].value))
        const currentVal = VALUES.indexOf(card.value)
        correct = (guess === 'Inside' && currentVal > lowestValue && currentVal < highestValue) ||
                 (guess === 'Outside' && (currentVal < lowestValue || currentVal > highestValue))
        break
      case 3: // Suit
        correct = guess === card.suit
        break
      case 4: // Number
        correct = guess === card.value
        break
    }

    const newCards = [...cards]
    newCards[currentRound].revealed = true
    setCards(newCards)

    if (correct) {
      setMultiplier(multiplier * 1.5)
      playSound('correct')
      if (currentRound === 4) {
        const winnings = betAmount * multiplier * 1.5
        updateBalance(gameData.balance + winnings)
        setTimeout(() => setGameState('won'), 1000)
      } else {
        setCurrentRound(currentRound + 1)
      }
    } else {
      playSound('wrong')
      newCards.forEach(card => card.revealed = true)
      setCards(newCards)
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
          <h2 className="text-2xl font-bold text-yellow-400 shadow-text">Ride The Bus</h2>
          <div className="flex">
            <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-500 mr-2" onClick={() => setGameState('launcher')}>
              <Home className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-500" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        <div className="flex justify-between mb-4 text-sm">
          <span>Bet: {betAmount} 🪙</span>
          <span className="text-green-400">Difficulty: {difficulty}</span>
        </div>
        <p className="text-center text-yellow-400 mb-4 text-xl font-bold">MULTIPLIER - {multiplier.toFixed(2)}x</p>
        <h3 className="text-center mb-4 text-lg font-semibold">{ROUNDS[currentRound]}</h3>
        <div className="flex justify-center mb-6 perspective">
          {cards.map((card, index) => (
            <div key={index} className="card-container">
              <div className={`card ${card.revealed ? 'revealed' : ''}`}>
                <div className="card-front">
                  <span className={`text-2xl font-bold ${card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}`}>
                    {card.value}{card.suit}
                  </span>
                </div>
                <div className="card-back"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentRound === 0 && (
            <>
              <Button onClick={() => handleGuess('Red')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg">Red</Button>
              <Button onClick={() => handleGuess('Black')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg">Black</Button>
            </>
          )}
          {currentRound === 1 && (
            <>
              <Button onClick={() => handleGuess('High')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg">High</Button>
              <Button onClick={() => handleGuess('Low')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg">Low</Button>
            </>
          )}
          {currentRound === 2 && (
            <>
              <Button onClick={() => handleGuess('Inside')} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg">Inside</Button>
              <Button onClick={() => handleGuess('Outside')} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-full transition-all duration-200 shadow-lg">Outside</Button>
            </>
          )}
          {currentRound === 3 && (
            <>
              {SUITS.map((suit) => (
                <Button key={suit} onClick={() => handleGuess(suit)} className={`${suit === '♥' || suit === '♦' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-900'} text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg`}>
                  {suit}
                </Button>
              ))}
            </>
          )}
          {currentRound === 4 && (
            <div className="col-span-2 grid grid-cols-4 gap-2">
              {VALUES.map((value) => (
                <Button key={value} onClick={() => handleGuess(value)} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded-full transition-all duration-200 shadow-lg">
                  {value}
                </Button>
              ))}
            </div>
          )}
        </div>
        <Button
          className={`w-full font-bold py-3 rounded-full transition-all duration-200 shadow-lg ${currentRound === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-black'}`}
          onClick={handleCashout}
          disabled={currentRound === 0}
        >
          {currentRound === 0 ? 'Cashout Unavailable' : `Cashout ${(betAmount * multiplier).toFixed(0)} 🪙`}
        </Button>
      </CardContent>
    </Card>
  )
}