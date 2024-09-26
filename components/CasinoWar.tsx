import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Volume2, VolumeX } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface CasinoWarCard {
  suit: string
  value: string
}

interface CasinoWarProps {
  betAmount: number
  gameData: { balance: number }
  updateBalance: (newBalance: number) => void
  setGameState: (state: 'won' | 'lost' | 'setup') => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
}

const SUITS = ['♠', '♥', '♦', '♣']
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

export default function CasinoWar({
  betAmount,
  gameData,
  updateBalance,
  setGameState,
  soundEnabled,
  setSoundEnabled,
}: CasinoWarProps) {
  const [playerCard, setPlayerCard] = useState<CasinoWarCard | null>(null)
  const [dealerCard, setDealerCard] = useState<CasinoWarCard | null>(null)
  const [message, setMessage] = useState("Place your bet and play!")
  const [isWar, setIsWar] = useState(false)
  const [warDialogOpen, setWarDialogOpen] = useState(false)

  const playSound = (soundName: string) => {
    if (soundEnabled) {
      const audio = new Audio(`/sounds/${soundName}.mp3`)
      audio.play()
    }
  }

  const drawCard = (): CasinoWarCard => {
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)]
    const value = VALUES[Math.floor(Math.random() * VALUES.length)]
    return { suit, value }
  }

  const compareCards = (card1: CasinoWarCard, card2: CasinoWarCard): number => {
    const value1 = VALUES.indexOf(card1.value)
    const value2 = VALUES.indexOf(card2.value)
    return value1 - value2
  }

  const playRound = () => {
    if (gameData.balance < betAmount) {
      setMessage("Not enough chips to play!")
      return
    }

    updateBalance(gameData.balance - betAmount)
    const pCard = drawCard()
    const dCard = drawCard()
    setPlayerCard(pCard)
    setDealerCard(dCard)
    setMessage("Drawing cards...")

    setTimeout(() => {
      const result = compareCards(pCard, dCard)
      if (result > 0) {
        updateBalance(gameData.balance + betAmount * 2)
        setMessage("You win!")
        playSound('win')
      } else if (result < 0) {
        setMessage("You lose!")
        playSound('lose')
      } else {
        setWarDialogOpen(true)
        setMessage("It's a tie! Do you want to go to war?")
        setIsWar(true)
      }
    }, 1000)
  }

  const goToWar = () => {
    setWarDialogOpen(false)
    if (gameData.balance < betAmount) {
      setMessage("Not enough chips to go to war!")
      setIsWar(false)
      return
    }

    updateBalance(gameData.balance - betAmount)
    setMessage("Going to war!")

    setTimeout(() => {
      const pCard = drawCard()
      const dCard = drawCard()
      setPlayerCard(pCard)
      setDealerCard(dCard)

      setTimeout(() => {
        const result = compareCards(pCard, dCard)
        if (result > 0) {
          updateBalance(gameData.balance + betAmount * 4)
          setMessage("You won the war!")
          playSound('win')
        } else if (result < 0) {
          setMessage("You lost the war!")
          playSound('lose')
        } else {
          updateBalance(gameData.balance + betAmount * 3)
          setMessage("It's another tie! You win 1:1")
          playSound('win')
        }
        setIsWar(false)
      }, 1000)
    }, 1000)
  }

  const surrender = () => {
    setWarDialogOpen(false)
    const lossAmount = Math.floor(betAmount / 2)
    updateBalance(gameData.balance + lossAmount)
    setMessage(`You surrendered. You lost ${lossAmount} chips.`)
    setIsWar(false)
    playSound('lose')
  }

  return (
    <Card className="bg-gradient-to-b from-purple-900 to-indigo-900 text-white shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-500" onClick={() => setGameState('setup')}>
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
          <h2 className="text-2xl font-bold text-yellow-400 shadow-text">Casino War</h2>
          <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-500" onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>
        </div>
        <div className="flex justify-between mb-4 text-sm">
          <span>Chips: {gameData.balance}</span>
          <span className="text-green-400">Bet: {betAmount}</span>
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <div className="w-24 h-36 bg-white rounded-lg flex items-center justify-center">
            {playerCard && (
              <span className={`text-4xl ${playerCard.suit === "♥" || playerCard.suit === "♦" ? "text-red-500" : "text-black"}`}>
                {playerCard.value}{playerCard.suit}
              </span>
            )}
          </div>
          <div className="text-3xl font-bold flex items-center">VS</div>
          <div className="w-24 h-36 bg-white rounded-lg flex items-center justify-center">
            {dealerCard && (
              <span className={`text-4xl ${dealerCard.suit === "♥" || dealerCard.suit === "♦" ? "text-red-500" : "text-black"}`}>
                {dealerCard.value}{dealerCard.suit}
              </span>
            )}
          </div>
        </div>
        <p className="text-center mb-4">{message}</p>
        <Button
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg"
          onClick={playRound}
          disabled={isWar}
        >
          {isWar ? "Waiting for decision..." : "Play"}
        </Button>
      </CardContent>
      <Dialog open={warDialogOpen} onOpenChange={setWarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>It&apos;s a tie!</DialogTitle>
            <DialogDescription>
              Do you want to go to war or surrender?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={surrender}>Surrender</Button>
            <Button onClick={goToWar}>Go to War</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}