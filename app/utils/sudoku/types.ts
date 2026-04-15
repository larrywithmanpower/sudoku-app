// 數獨核心型別定義

export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type Board = CellValue[][]
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface CellState {
  value: CellValue
  given: boolean       // 是否為題目給定的格子
  notes: Set<number>   // 筆記模式
  isError: boolean
  isHighlighted: boolean
  isSelected: boolean
}

export interface GamePuzzle {
  puzzle: Board        // 謎題（含 0 代表空格）
  solution: Board      // 完整解答
  difficulty: Difficulty
}

export interface BestRecord {
  easy: number | null
  medium: number | null
  hard: number | null
}
