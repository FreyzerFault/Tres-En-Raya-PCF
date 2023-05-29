import React, { FC } from 'react'

interface ISquareProps {
  children?: React.ReactNode
  isSelected?: boolean
  updateBoard?: (boardIndex: number) => void
  index?: number
}

export const Square: FC<ISquareProps> = ({
  children = '',
  isSelected = false,
  updateBoard = () => {},
  index = 0,
}) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`

  const handleClick = () => {
    updateBoard(index)
  }

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}
