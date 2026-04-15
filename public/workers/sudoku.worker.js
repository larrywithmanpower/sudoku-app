// Web Worker：數獨謎題產生器
// 在背景執行，避免阻塞 UI 主執行緒

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function isValidPlacement(board, row, col, num) {
  if (num === 0) return true
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) return false
  }
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) return false
  }
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) return false
    }
  }
  return true
}

function cloneBoard(board) {
  return board.map(row => [...row])
}

function getCandidates(board, row, col) {
  if (board[row][col] !== 0) return new Set()
  const used = new Set()
  for (let c = 0; c < 9; c++) { if (board[row][c] !== 0) used.add(board[row][c]) }
  for (let r = 0; r < 9; r++) { if (board[r][col] !== 0) used.add(board[r][col]) }
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] !== 0) used.add(board[r][c])
    }
  }
  const candidates = new Set()
  for (let n = 1; n <= 9; n++) { if (!used.has(n)) candidates.add(n) }
  return candidates
}

function countSolutions(board, limit = 2) {
  const grid = cloneBoard(board)
  let count = 0

  function solve() {
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

    if (targetRow === -1) {
      count++
      return count >= limit
    }

    const candidates = getCandidates(grid, targetRow, targetCol)
    for (const num of candidates) {
      grid[targetRow][targetCol] = num
      if (solve()) return true
      grid[targetRow][targetCol] = 0
    }
    return false
  }

  solve()
  return count
}

function fillBoard(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
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

const CELLS_TO_REMOVE = { easy: 35, medium: 45, hard: 52 }

function generatePuzzle(difficulty) {
  const solution = Array.from({ length: 9 }, () => Array(9).fill(0))
  fillBoard(solution)

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
    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[r][c] = backup
    } else {
      removed++
    }
  }

  return { puzzle, solution, difficulty }
}

self.onmessage = function (e) {
  const { type, difficulty, id } = e.data
  if (type === 'generate') {
    try {
      const result = generatePuzzle(difficulty)
      self.postMessage({ type: 'result', id, result })
    } catch (err) {
      self.postMessage({ type: 'error', id, error: err.message })
    }
  }
}
