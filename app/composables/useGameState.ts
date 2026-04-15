import { ref, computed, reactive } from 'vue'
import type { Board, CellValue, Difficulty, GamePuzzle, BestRecord } from '~/utils/sudoku/types'
import { cloneBoard, findErrors } from '~/utils/sudoku/validator'
import { solvePuzzleAnimated } from '~/utils/sudoku/solver'

const BEST_RECORD_KEY = 'sudoku-best-records'

function loadBestRecords(): BestRecord {
  if (!import.meta.client) return { easy: null, medium: null, hard: null }
  try {
    const raw = localStorage.getItem(BEST_RECORD_KEY)
    return raw ? JSON.parse(raw) : { easy: null, medium: null, hard: null }
  } catch {
    return { easy: null, medium: null, hard: null }
  }
}

function saveBestRecord(difficulty: Difficulty, seconds: number) {
  if (!import.meta.client) return
  const records = loadBestRecords()
  if (records[difficulty] === null || seconds < records[difficulty]!) {
    records[difficulty] = seconds
    localStorage.setItem(BEST_RECORD_KEY, JSON.stringify(records))
  }
}

export function useGameState() {
  const puzzle = ref<Board | null>(null)
  const solution = ref<Board | null>(null)
  const userBoard = ref<Board | null>(null)
  const difficulty = ref<Difficulty>('easy')
  const selectedCell = ref<{ row: number; col: number } | null>(null)
  const givenCells = ref<boolean[][]>([])
  const isLoading = ref(false)
  const isComplete = ref(false)
  const isSolving = ref(false)
  const noteMode = ref(false)
  const notes = ref<Set<number>[][]>(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>()))
  )
  const bestRecords = reactive(loadBestRecords())
  let worker: Worker | null = null

  // 找出錯誤格子
  const errorCells = computed<Set<string>>(() => {
    if (!userBoard.value || !solution.value) return new Set()
    return findErrors(userBoard.value, solution.value)
  })

  // 已填入數字計數
  const filledCount = computed(() => {
    if (!userBoard.value) return 0
    return userBoard.value.flat().filter(v => v !== 0).length
  })

  function initNotes() {
    notes.value = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => new Set<number>())
    )
  }

  function loadPuzzle(gamePuzzle: GamePuzzle) {
    puzzle.value = cloneBoard(gamePuzzle.puzzle)
    solution.value = cloneBoard(gamePuzzle.solution)
    userBoard.value = cloneBoard(gamePuzzle.puzzle)
    difficulty.value = gamePuzzle.difficulty
    givenCells.value = gamePuzzle.puzzle.map(row => row.map(v => v !== 0))
    selectedCell.value = null
    isComplete.value = false
    isSolving.value = false
    initNotes()
  }

  function selectCell(row: number, col: number) {
    selectedCell.value = { row, col }
  }

  function inputNumber(num: CellValue) {
    if (!userBoard.value || !selectedCell.value || isComplete.value || isSolving.value) return
    const { row, col } = selectedCell.value
    if (givenCells.value[row]?.[col]) return

    if (noteMode.value && num !== 0) {
      const noteSet = notes.value[row][col]
      if (noteSet.has(num)) {
        noteSet.delete(num)
      } else {
        noteSet.add(num)
      }
      return
    }

    userBoard.value[row][col] = num
    if (num !== 0) notes.value[row][col].clear()

    // 檢查是否完成
    checkCompletion()
  }

  function checkCompletion() {
    if (!userBoard.value || !solution.value) return
    const complete = userBoard.value.every((row, r) =>
      row.every((val, c) => val === solution.value![r][c])
    )
    if (complete) {
      isComplete.value = true
    }
  }

  function getHint() {
    if (!userBoard.value || !solution.value || isComplete.value || isSolving.value) return
    const { row, col } = selectedCell.value ?? { row: -1, col: -1 }

    // 優先填選中的格子
    if (row >= 0 && col >= 0 && !givenCells.value[row]?.[col] && userBoard.value[row][col] === 0) {
      userBoard.value[row][col] = solution.value[row][col]
      notes.value[row][col].clear()
      checkCompletion()
      return
    }

    // 找第一個空格給提示
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!givenCells.value[r]?.[c] && userBoard.value[r][c] === 0) {
          userBoard.value[r][c] = solution.value[r][c]
          notes.value[r][c].clear()
          selectedCell.value = { row: r, col: c }
          checkCompletion()
          return
        }
      }
    }
  }

  async function autoSolve(onStep?: (board: Board) => void) {
    if (!solution.value || isSolving.value) return
    isSolving.value = true
    noteMode.value = false
    initNotes()

    // 重置為題目初始狀態
    if (puzzle.value) {
      userBoard.value = cloneBoard(puzzle.value)
    }

    const gen = solvePuzzleAnimated(userBoard.value!, 20)
    for await (const step of gen) {
      if (!isSolving.value) break
      if (userBoard.value) {
        userBoard.value[step.row][step.col] = step.value
        onStep?.(cloneBoard(userBoard.value))
      }
      // 讓 Vue 響應式更新
      await new Promise(resolve => requestAnimationFrame(resolve))
    }

    // 最終顯示完整解
    if (isSolving.value && solution.value) {
      userBoard.value = cloneBoard(solution.value)
      isComplete.value = true
    }
    isSolving.value = false
  }

  function stopSolving() {
    isSolving.value = false
  }

  function startWorkerGeneration(diff: Difficulty): Promise<GamePuzzle> {
    return new Promise((resolve, reject) => {
      if (!import.meta.client) {
        // SSR fallback（不應發生）
        reject(new Error('Worker not available in SSR'))
        return
      }

      if (worker) {
        worker.terminate()
      }

      worker = new Worker(`${import.meta.env.BASE_URL}workers/sudoku.worker.js`)
      const id = Date.now().toString()

      worker.onmessage = (e) => {
        if (e.data.id === id && e.data.type === 'result') {
          resolve(e.data.result as GamePuzzle)
          worker?.terminate()
          worker = null
        } else if (e.data.type === 'error') {
          reject(new Error(e.data.error))
          worker?.terminate()
          worker = null
        }
      }

      worker.onerror = (err) => {
        reject(err)
        worker = null
      }

      worker.postMessage({ type: 'generate', difficulty: diff, id })
    })
  }

  async function newGame(diff: Difficulty) {
    isLoading.value = true
    isComplete.value = false
    isSolving.value = false
    difficulty.value = diff
    try {
      const gamePuzzle = await startWorkerGeneration(diff)
      loadPuzzle(gamePuzzle)
    } catch (e) {
      console.error('產生謎題失敗', e)
    } finally {
      isLoading.value = false
    }
  }

  function recordBestTime(seconds: number) {
    saveBestRecord(difficulty.value, seconds)
    const updated = loadBestRecords()
    bestRecords.easy = updated.easy
    bestRecords.medium = updated.medium
    bestRecords.hard = updated.hard
  }

  function formatTime(seconds: number | null): string {
    if (seconds === null) return '--:--'
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return {
    puzzle,
    solution,
    userBoard,
    difficulty,
    selectedCell,
    givenCells,
    isLoading,
    isComplete,
    isSolving,
    noteMode,
    notes,
    errorCells,
    filledCount,
    bestRecords,
    selectCell,
    inputNumber,
    getHint,
    autoSolve,
    stopSolving,
    newGame,
    loadPuzzle,
    recordBestTime,
    formatTime
  }
}
