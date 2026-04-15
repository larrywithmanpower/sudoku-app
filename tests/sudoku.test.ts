import { describe, it, expect } from 'vitest'
import { isValidPlacement, getCandidates, isBoardComplete, cloneBoard, findErrors } from '../app/utils/sudoku/validator'
import { solvePuzzle, countSolutions } from '../app/utils/sudoku/solver'
import { generatePuzzle } from '../app/utils/sudoku/generator'
import type { Board, CellValue } from '../app/utils/sudoku/types'

// 已知合法的數獨謎題
const KNOWN_PUZZLE: Board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
] as Board

const KNOWN_SOLUTION: Board = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9]
] as Board

describe('validator', () => {
  it('isValidPlacement: 合法放置應回傳 true', () => {
    const board = cloneBoard(KNOWN_PUZZLE)
    expect(isValidPlacement(board, 0, 2, 4)).toBe(true)
  })

  it('isValidPlacement: 違反列規則應回傳 false', () => {
    const board = cloneBoard(KNOWN_PUZZLE)
    expect(isValidPlacement(board, 0, 2, 5)).toBe(false) // 5 已在第 0 列
  })

  it('isValidPlacement: 違反行規則應回傳 false', () => {
    const board = cloneBoard(KNOWN_PUZZLE)
    expect(isValidPlacement(board, 0, 2, 9)).toBe(false) // 9 已在第 2 行
  })

  it('isValidPlacement: 違反宮格規則應回傳 false', () => {
    const board = cloneBoard(KNOWN_PUZZLE)
    expect(isValidPlacement(board, 0, 2, 3)).toBe(false) // 3 在同一宮格
  })

  it('getCandidates: 應回傳正確候選數', () => {
    const board = cloneBoard(KNOWN_PUZZLE)
    const candidates = getCandidates(board, 0, 2)
    expect(candidates.has(4)).toBe(true)
    expect(candidates.has(5)).toBe(false) // 已在列中
  })

  it('isBoardComplete: 完整解應回傳 true', () => {
    expect(isBoardComplete(KNOWN_SOLUTION)).toBe(true)
  })

  it('isBoardComplete: 含空格應回傳 false', () => {
    expect(isBoardComplete(KNOWN_PUZZLE)).toBe(false)
  })

  it('findErrors: 應找出錯誤格子', () => {
    const board = cloneBoard(KNOWN_SOLUTION)
    board[0][0] = 9 as CellValue // 故意放錯
    const errors = findErrors(board, KNOWN_SOLUTION)
    expect(errors.has('0-0')).toBe(true)
    expect(errors.size).toBe(1)
  })

  it('cloneBoard: 複製後修改不影響原板', () => {
    const orig = cloneBoard(KNOWN_PUZZLE)
    const copy = cloneBoard(orig)
    copy[0][0] = 9 as CellValue
    expect(orig[0][0]).toBe(5)
  })
})

describe('solver', () => {
  it('solvePuzzle: 應解出已知謎題', () => {
    const result = solvePuzzle(KNOWN_PUZZLE)
    expect(result).not.toBeNull()
    expect(result![0][2]).toBe(4)
    expect(isBoardComplete(result!)).toBe(true)
  })

  it('solvePuzzle: 解答應與已知解一致', () => {
    const result = solvePuzzle(KNOWN_PUZZLE)
    expect(JSON.stringify(result)).toBe(JSON.stringify(KNOWN_SOLUTION))
  })

  it('countSolutions: 唯一解謎題應回傳 1', () => {
    expect(countSolutions(KNOWN_PUZZLE, 2)).toBe(1)
  })

  it('countSolutions: 空棋盤解數應大於 1', () => {
    const empty: Board = Array.from({ length: 9 }, () => Array(9).fill(0)) as Board
    expect(countSolutions(empty, 2)).toBeGreaterThan(1)
  })
})

describe('generator', () => {
  it('應產生合法謎題（簡單）', () => {
    const { puzzle, solution } = generatePuzzle('easy')
    expect(isBoardComplete(solution)).toBe(true)
    // 謎題含空格
    const emptyCount = puzzle.flat().filter(v => v === 0).length
    expect(emptyCount).toBeGreaterThan(30)
  })

  it('謎題應保證唯一解', () => {
    const { puzzle } = generatePuzzle('easy')
    expect(countSolutions(puzzle, 2)).toBe(1)
  })

  it('應產生合法謎題（困難）', () => {
    const { puzzle, solution } = generatePuzzle('hard')
    expect(isBoardComplete(solution)).toBe(true)
    const emptyCount = puzzle.flat().filter(v => v === 0).length
    expect(emptyCount).toBeGreaterThanOrEqual(50)
  })

  it('謎題格子應與解答一致（非空格部分）', () => {
    const { puzzle, solution } = generatePuzzle('medium')
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzle[r][c] !== 0) {
          expect(puzzle[r][c]).toBe(solution[r][c])
        }
      }
    }
  })
})
