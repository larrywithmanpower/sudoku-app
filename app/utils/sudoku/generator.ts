import type { Board, CellValue, Difficulty, GamePuzzle } from './types'
import { isValidPlacement, cloneBoard } from './validator'
import { countSolutions } from './solver'

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 難度對應移除格子數 */
const CELLS_TO_REMOVE: Record<Difficulty, number> = {
  easy: 35,
  medium: 45,
  hard: 52
}

/** 使用 Backtracking 填滿完整數獨解 */
function fillBoard(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9] as CellValue[])
        for (const num of nums) {
          if (isValidPlacement(board, r, c, num)) {
            board[r][c] = num
            if (fillBoard(board)) return true
            board[r][c] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

/** 建立空棋盤 */
function emptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array(9).fill(0)) as Board
}

/** 產生數獨謎題（保證唯一解） */
export function generatePuzzle(difficulty: Difficulty): GamePuzzle {
  // 1. 填滿完整解
  const solution = emptyBoard()
  fillBoard(solution)

  // 2. 依難度移除格子，確保唯一解
  const puzzle = cloneBoard(solution)
  const cellsToRemove = CELLS_TO_REMOVE[difficulty]
  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
  )

  let removed = 0
  for (const [r, c] of positions) {
    if (removed >= cellsToRemove) break

    const backup = puzzle[r][c]
    puzzle[r][c] = 0

    // 確認唯一解
    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[r][c] = backup // 還原
    } else {
      removed++
    }
  }

  return {
    puzzle: cloneBoard(puzzle),
    solution: cloneBoard(solution),
    difficulty
  }
}
