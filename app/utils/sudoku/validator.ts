import type { Board, CellValue } from './types'

/** 檢查在棋盤指定位置放入數字是否合法 */
export function isValidPlacement(board: Board, row: number, col: number, num: CellValue): boolean {
  if (num === 0) return true

  // 檢查同列
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) return false
  }

  // 檢查同行
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) return false
  }

  // 檢查 3x3 宮格
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) return false
    }
  }

  return true
}

/** 找出指定格子可填入的候選數字 */
export function getCandidates(board: Board, row: number, col: number): Set<number> {
  if (board[row][col] !== 0) return new Set()

  const used = new Set<number>()

  for (let c = 0; c < 9; c++) {
    if (board[row][c] !== 0) used.add(board[row][c])
  }

  for (let r = 0; r < 9; r++) {
    if (board[r][col] !== 0) used.add(board[r][col])
  }

  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] !== 0) used.add(board[r][c])
    }
  }

  const candidates = new Set<number>()
  for (let n = 1; n <= 9; n++) {
    if (!used.has(n)) candidates.add(n)
  }
  return candidates
}

/** 深度複製棋盤 */
export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]) as Board
}

/** 檢查棋盤是否完整填滿且合法 */
export function isBoardComplete(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return false
      if (!isValidPlacement(board, r, c, board[r][c] as CellValue)) return false
    }
  }
  return true
}

/** 找出棋盤中所有錯誤格子的位置 */
export function findErrors(board: Board, solution: Board): Set<string> {
  const errors = new Set<string>()
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0 && board[r][c] !== solution[r][c]) {
        errors.add(`${r}-${c}`)
      }
    }
  }
  return errors
}
