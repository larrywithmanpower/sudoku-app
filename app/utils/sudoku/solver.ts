import type { Board, CellValue } from './types'
import { getCandidates, cloneBoard } from './validator'

/** Backtracking + Constraint Propagation 解題器
 *  @returns 找到的解答數量（最多計算到 2，用於唯一解驗證） */
export function countSolutions(board: Board, limit = 2): number {
  const grid = cloneBoard(board)
  let count = 0

  function solve(): boolean {
    // 找候選數最少的空格（MRV heuristic）
    let minLen = Infinity
    let targetRow = -1
    let targetCol = -1

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          const cands = getCandidates(grid, r, c)
          if (cands.size === 0) return false // 死路
          if (cands.size < minLen) {
            minLen = cands.size
            targetRow = r
            targetCol = c
          }
        }
      }
    }

    if (targetRow === -1) {
      // 已完全填滿
      count++
      return count >= limit
    }

    const candidates = getCandidates(grid, targetRow, targetCol)
    for (const num of candidates) {
      grid[targetRow][targetCol] = num as CellValue
      if (solve()) return true
      grid[targetRow][targetCol] = 0
    }

    return false
  }

  solve()
  return count
}

/** 回傳完整解答（找不到回傳 null） */
export function solvePuzzle(board: Board): Board | null {
  const grid = cloneBoard(board)

  function solve(): boolean {
    let minLen = Infinity
    let targetRow = -1
    let targetCol = -1

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          const cands = getCandidates(grid, r, c)
          if (cands.size === 0) return false
          if (cands.size < minLen) {
            minLen = cands.size
            targetRow = r
            targetCol = c
          }
        }
      }
    }

    if (targetRow === -1) return true

    const candidates = getCandidates(grid, targetRow, targetCol)
    for (const num of candidates) {
      grid[targetRow][targetCol] = num as CellValue
      if (solve()) return true
      grid[targetRow][targetCol] = 0
    }

    return false
  }

  return solve() ? grid : null
}

/** 逐步解題生成器（用於動畫展示），回傳每一步的棋盤狀態與操作資訊 */
export interface SolveStep {
  row: number
  col: number
  value: CellValue
  board: Board
  type: 'set' | 'backtrack'
}

export async function* solvePuzzleAnimated(
  board: Board,
  delayMs: number = 30
): AsyncGenerator<SolveStep> {
  const grid = cloneBoard(board)
  const steps: SolveStep[] = []

  function solve(): boolean {
    let minLen = Infinity
    let targetRow = -1
    let targetCol = -1

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          const cands = getCandidates(grid, r, c)
          if (cands.size === 0) return false
          if (cands.size < minLen) {
            minLen = cands.size
            targetRow = r
            targetCol = c
          }
        }
      }
    }

    if (targetRow === -1) return true

    const candidates = getCandidates(grid, targetRow, targetCol)
    for (const num of candidates) {
      grid[targetRow][targetCol] = num as CellValue
      steps.push({
        row: targetRow,
        col: targetCol,
        value: num as CellValue,
        board: cloneBoard(grid),
        type: 'set'
      })
      if (solve()) return true
      grid[targetRow][targetCol] = 0
      steps.push({
        row: targetRow,
        col: targetCol,
        value: 0,
        board: cloneBoard(grid),
        type: 'backtrack'
      })
    }

    return false
  }

  solve()

  for (const step of steps) {
    yield step
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
}
