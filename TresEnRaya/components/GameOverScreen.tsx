import React, { FC } from 'react'
import { GAME_STATE } from '../constants'
import { Square } from './Square'

interface IGameOverScreenProps {
  winner: string | null
  gameState: string
  onReset: () => void
}

export const GameOverScreen: FC<IGameOverScreenProps> = ({ winner, gameState, onReset }) => {
  const isPlaying = gameState == GAME_STATE.playing
  const isWin = gameState == GAME_STATE.win
  const isEmpate = gameState == GAME_STATE.empate

  if (isPlaying) return null

  const message = isEmpate ? 'Empate' : 'Ganó'

  return (
    <section className='winner'>
      <div className='text'>
        <h2>{message}</h2>

        {isWin && <header className='win'>{<Square>{winner}</Square>}</header>}

        <footer>
          <button onClick={onReset}>RESET</button>
        </footer>
      </div>
    </section>
  )
}
