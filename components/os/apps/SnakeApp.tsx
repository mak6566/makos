'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const COLS = 20
const ROWS = 18
const CELL = 16

type Point = { x: number; y: number }
type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

function randomFood(snake: Point[]): Point {
  while (true) {
    const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p
  }
}

export default function SnakeApp() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 9 }])
  const [food, setFood] = useState<Point>({ x: 5, y: 5 })
  const [dir, setDir] = useState<Dir>('RIGHT')
  const [running, setRunning] = useState(false)
  const [dead, setDead] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const dirRef = useRef<Dir>('RIGHT')
  const snakeRef = useRef<Point[]>([{ x: 10, y: 9 }])
  const foodRef = useRef<Point>({ x: 5, y: 5 })

  // sync refs
  useEffect(() => { snakeRef.current = snake }, [snake])
  useEffect(() => { foodRef.current = food }, [food])
  useEffect(() => { dirRef.current = dir }, [dir])

  const reset = useCallback(() => {
    const start = [{ x: 10, y: 9 }]
    setSnake(start)
    snakeRef.current = start
    const f = randomFood(start)
    setFood(f)
    foodRef.current = f
    setDir('RIGHT')
    dirRef.current = 'RIGHT'
    setDead(false)
    setScore(0)
    setRunning(true)
  }, [])

  // keyboard controls — captured on window so they work even if canvas isn't focused
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
        W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
      }
      const newDir = map[e.key]
      if (!newDir) return
      // prevent reverse
      const cur = dirRef.current
      if (
        (newDir === 'UP' && cur === 'DOWN') ||
        (newDir === 'DOWN' && cur === 'UP') ||
        (newDir === 'LEFT' && cur === 'RIGHT') ||
        (newDir === 'RIGHT' && cur === 'LEFT')
      ) return
      e.preventDefault()
      dirRef.current = newDir
      setDir(newDir)
      if (!running && !dead) setRunning(true)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [running, dead])

  // game loop
  useEffect(() => {
    if (!running || dead) return
    const interval = setInterval(() => {
      const s = snakeRef.current
      const d = dirRef.current
      const head = s[0]
      const next: Point = {
        x: (head.x + (d === 'RIGHT' ? 1 : d === 'LEFT' ? -1 : 0) + COLS) % COLS,
        y: (head.y + (d === 'DOWN' ? 1 : d === 'UP' ? -1 : 0) + ROWS) % ROWS,
      }

      // self collision
      if (s.some((p) => p.x === next.x && p.y === next.y)) {
        setRunning(false)
        setDead(true)
        setHighScore((h) => Math.max(h, s.length - 1))
        return
      }

      const ate = next.x === foodRef.current.x && next.y === foodRef.current.y
      const newSnake = ate ? [next, ...s] : [next, ...s.slice(0, -1)]
      setSnake(newSnake)
      snakeRef.current = newSnake

      if (ate) {
        setScore((sc) => sc + 1)
        const nf = randomFood(newSnake)
        setFood(nf)
        foodRef.current = nf
      }
    }, 130)
    return () => clearInterval(interval)
  }, [running, dead])

  const dpadBtn = (label: string, action: () => void) => (
    <button
      onPointerDown={action}
      style={{
        width: 36, height: 36,
        background: '#1a1a1a',
        border: '2px solid #333',
        color: '#d0d0d0',
        fontSize: 13,
        cursor: 'pointer',
        borderRadius: 0,
        fontFamily: "'Share Tech Mono', monospace",
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px 12px',
      gap: 8,
      background: '#0d0d0d',
      fontFamily: "'Share Tech Mono', monospace",
      userSelect: 'none',
    }}>
      {/* score bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: COLS * CELL,
        fontSize: 11,
        color: '#555',
      }}>
        <span>score: <span style={{ color: '#4ec94e' }}>{score}</span></span>
        <span>best: <span style={{ color: '#1793d1' }}>{highScore}</span></span>
      </div>

      {/* game grid */}
      <div style={{
        width: COLS * CELL,
        height: ROWS * CELL,
        border: '2px solid #1793d1',
        background: '#080808',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* grid lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
          {Array.from({ length: COLS + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * CELL} y1={0} x2={i * CELL} y2={ROWS * CELL} stroke="#fff" strokeWidth={1} />
          ))}
          {Array.from({ length: ROWS + 1 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * CELL} x2={COLS * CELL} y2={i * CELL} stroke="#fff" strokeWidth={1} />
          ))}
        </svg>

        {/* food */}
        <div style={{
          position: 'absolute',
          left: food.x * CELL + 2, top: food.y * CELL + 2,
          width: CELL - 4, height: CELL - 4,
          background: '#cc3333',
          boxShadow: '0 0 4px #cc3333',
        }} />

        {/* snake */}
        {snake.map((seg, i) => (
          <div
            key={`${seg.x}-${seg.y}-${i}`}
            style={{
              position: 'absolute',
              left: seg.x * CELL + 1, top: seg.y * CELL + 1,
              width: CELL - 2, height: CELL - 2,
              background: i === 0 ? '#4ec94e' : '#1793d1',
              opacity: i === 0 ? 1 : Math.max(0.3, 1 - i * 0.04),
            }}
          />
        ))}

        {/* start overlay */}
        {!running && !dead && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <p style={{ color: '#1793d1', fontSize: 13 }}>snake.exe</p>
            <p style={{ color: '#555', fontSize: 10 }}>press start or use arrow keys</p>
          </div>
        )}

        {/* game over overlay */}
        {dead && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <p style={{ color: '#cc3333', fontSize: 13 }}>GAME OVER</p>
            <p style={{ color: '#555', fontSize: 10 }}>score: {score}</p>
          </div>
        )}
      </div>

      {/* start/restart button */}
      <button
        onClick={reset}
        style={{
          background: dead || !running ? '#1793d1' : '#1a1a1a',
          color: dead || !running ? '#000' : '#555',
          border: '2px solid #1793d1',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 11,
          padding: '4px 20px',
          cursor: 'pointer',
          borderRadius: 0,
          width: COLS * CELL,
        }}
      >
        {dead ? '[ play again ]' : running ? '[ restart ]' : '[ start ]'}
      </button>

      {/* d-pad */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div>{dpadBtn('▲', () => { if (dirRef.current !== 'DOWN') { dirRef.current = 'UP'; setDir('UP') }; if (!running) reset() })}</div>
        <div style={{ display: 'flex', gap: 2 }}>
          {dpadBtn('◀', () => { if (dirRef.current !== 'RIGHT') { dirRef.current = 'LEFT'; setDir('LEFT') }; if (!running) reset() })}
          {dpadBtn('▼', () => { if (dirRef.current !== 'UP') { dirRef.current = 'DOWN'; setDir('DOWN') }; if (!running) reset() })}
          {dpadBtn('▶', () => { if (dirRef.current !== 'LEFT') { dirRef.current = 'RIGHT'; setDir('RIGHT') }; if (!running) reset() })}
        </div>
      </div>

      <p style={{ fontSize: 9, color: '#333' }}>arrow keys / wasd</p>
    </div>
  )
}
