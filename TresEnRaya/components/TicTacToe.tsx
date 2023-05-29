import './TicTacToe.css'

import React, { FC } from 'react'
import { useEffect, useState } from 'react'

//import { Label } from '@fluentui/react'

// CONFETTI
import Confetti from 'react-confetti'

import { GAME_STATE, TURNS } from '../constants'
import { checkBoardIsFull, checkWinnerFrom, EMPTY_BOARD } from '../logic/board'
import { GameOverScreen } from './GameOverScreen'
import { Square } from './Square'

export interface ITicTacToeProps {
  children: string
}

export const TicTacToe: React.FC<ITicTacToeProps> = ({ children = 'TRES EN RAYA' }) => {
  // ================== ESTADOS ==================
  const [board, setBoard] = useState<Array<string>>(() => {
    const boardloaded = window.localStorage.getItem('board')
    return boardloaded ? JSON.parse(boardloaded) : EMPTY_BOARD
  })

  const [turn, setTurn] = useState(() => {
    const turnLoaded = window.localStorage.getItem('turn')
    return turnLoaded ? turnLoaded : TURNS.X
  })

  // winner = null si no hay ganador
  const [winner, setWinner] = useState(() => {
    const winnerLoaded = window.localStorage.getItem('winner')
    return winnerLoaded ? winnerLoaded : null
  })

  // Estados = Playing / WIN / Empate
  const [gameState, setGameState] = useState(() => {
    const gameStateLoaded = window.localStorage.getItem('gameState')
    return gameStateLoaded ? gameStateLoaded : GAME_STATE.playing
  })

  // ================== EFFECT ==================
  // Se ejecuta el arg1() cuando cambia el valor de una de sus Dependencias (arg2: [])
  useEffect(() => {
    saveLocalData('board', JSON.stringify(board))
    console.log('Board saved: ' + board)
  }, [board])

  useEffect(() => {
    saveLocalData('turn', turn)
    console.log('Turn saved: ' + turn)
  }, [turn])

  useEffect(() => {
    saveLocalData('winner', winner)
    console.log('Winner saved: ' + winner)
  }, [winner])

  useEffect(() => {
    saveLocalData('gameState', gameState)
    console.log('Game State saved: ' + gameState)
  }, [gameState])

  // CANVAS para Confetti
  const canvasConfetti = document.createElement('canvas')
  canvasConfetti.classList.add('confetti-canvas')
  canvasConfetti.width = 600
  canvasConfetti.height = 600
  let canvasContext = canvasConfetti.getContext('2d')
  if (canvasContext) {
    canvasContext.fillStyle = '#FFFFFF'
    canvasContext.fillRect(400, 400, 800, 800)
  }

  // ================== FUNCIONES de la LOGICA ==================
  function saveLocalData(key: string, data: any) {
    if (key && data) {
      window.localStorage.setItem(key, data)
    }
  }

  // Pasar Turno al otro Jugador
  function endTurn() {
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    // Guarda el turno en memoria
    saveLocalData('turn', newTurn)

    return newTurn
  }

  function switchGameState(newGameState: string) {
    setGameState(newGameState)
    saveLocalData('gameState', newGameState)
  }

  function updateWinner(newWinner: string | undefined | null) {
    if (newWinner) {
      setWinner(newWinner)
      switchGameState(GAME_STATE.win)
      saveLocalData('winner', newWinner)
    }
  }

  const updateBoard = (index: number) => {
    // No hacer nada si la casilla esta llena
    if (board[index] || winner) return

    // Actualizar el board con el nuevo valor
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // saveLocalData('board', JSON.stringify(newBoard))

    // Comprueba si hay GANADOR
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      updateWinner(newWinner)
      return
    }
    // Comprueba si se ha llenado el tablero
    if (checkBoardIsFull(newBoard)) {
      switchGameState(GAME_STATE.empate)
      return
    }

    // Pasar turno
    endTurn()
  }

  // RESETEO del JUEGO al completo
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    setGameState(GAME_STATE.playing)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
    window.localStorage.removeItem('winner')
    window.localStorage.removeItem('gameState')
  }

  // Construccion del COMPONENTE
  return (
    <main className='board'>
      <h1>{children}</h1>

      <br />

      <button onClick={resetGame}>RESET</button>

      <section className='game'>
        {board.map((_, index) => {
          return (
            <Square isSelected={false} key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          )
        })}
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X} key={0} index={0} updateBoard={() => 0}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O} key={0} index={0} updateBoard={() => 0}>
          {TURNS.O}
        </Square>
      </section>

      <GameOverScreen gameState={gameState} winner={winner} onReset={resetGame}></GameOverScreen>

      {winner && <Confetti />}
    </main>
  )
}
