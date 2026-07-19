'use client'

import { useEffect, useRef, useState } from 'react'

type Op = '+' | '-' | '*' | '/' | null

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState<number | null>(null)
  const [op, setOp] = useState<Op>(null)
  const [fresh, setFresh] = useState(false)

  const input = (digit: string) => {
    if (fresh) {
      setDisplay(digit)
      setFresh(false)
    } else {
      setDisplay((d) => (d === '0' ? digit : d.length < 12 ? d + digit : d))
    }
  }

  const decimal = () => {
    if (fresh) {
      setDisplay('0.')
      setFresh(false)
      return
    }
    if (!display.includes('.')) setDisplay((d) => d + '.')
  }

  const chooseOp = (o: Op) => {
    setPrev(parseFloat(display))
    setOp(o)
    setFresh(true)
  }

  const calculate = () => {
    if (prev === null || op === null) return
    const cur = parseFloat(display)
    let result = 0
    if (op === '+') result = prev + cur
    else if (op === '-') result = prev - cur
    else if (op === '*') result = prev * cur
    else if (op === '/') result = cur === 0 ? 0 : prev / cur
    const str = parseFloat(result.toFixed(8)).toString()
    setDisplay(str.length > 12 ? result.toExponential(4) : str)
    setPrev(null)
    setOp(null)
    setFresh(true)
  }

  const clear = () => {
    setDisplay('0')
    setPrev(null)
    setOp(null)
    setFresh(false)
  }

  const toggleSign = () => setDisplay((d) => (d.startsWith('-') ? d.slice(1) : '-' + d))
  const percent = () => setDisplay((d) => String(parseFloat(d) / 100))

  // Use refs so the keydown handler always sees latest state without re-registering
  const stateRef = useRef({ display, prev, op, fresh })
  useEffect(() => { stateRef.current = { display, prev, op, fresh } }, [display, prev, op, fresh])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { display: d, prev: p, op: o, fresh: fr } = stateRef.current

      const localInput = (digit: string) => {
        setDisplay((cur) => fr ? digit : (cur === '0' ? digit : cur.length < 12 ? cur + digit : cur))
        setFresh(false)
      }
      const localDecimal = () => {
        if (fr) { setDisplay('0.'); setFresh(false); return }
        setDisplay((cur) => cur.includes('.') ? cur : cur + '.')
      }
      const localChooseOp = (newOp: Op) => {
        setPrev(parseFloat(d)); setOp(newOp); setFresh(true)
      }
      const localCalculate = () => {
        if (p === null || o === null) return
        const cur = parseFloat(d)
        let result = 0
        if (o === '+') result = p + cur
        else if (o === '-') result = p - cur
        else if (o === '*') result = p * cur
        else if (o === '/') result = cur === 0 ? 0 : p / cur
        const str = parseFloat(result.toFixed(8)).toString()
        setDisplay(str.length > 12 ? result.toExponential(4) : str)
        setPrev(null); setOp(null); setFresh(true)
      }
      const localClear = () => { setDisplay('0'); setPrev(null); setOp(null); setFresh(false) }

      if (e.key >= '0' && e.key <= '9') localInput(e.key)
      else if (e.key === '.') localDecimal()
      else if (e.key === '+') localChooseOp('+')
      else if (e.key === '-') localChooseOp('-')
      else if (e.key === '*') localChooseOp('*')
      else if (e.key === '/') { e.preventDefault(); localChooseOp('/') }
      else if (e.key === 'Enter' || e.key === '=') localCalculate()
      else if (e.key === 'Escape') localClear()
      else if (e.key === 'Backspace') setDisplay((cur) => cur.length > 1 ? cur.slice(0, -1) : '0')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pxBtn = (
    label: string,
    onClick: () => void,
    variant: 'op' | 'fn' | 'eq' | 'num' = 'num'
  ) => {
    const styles: Record<string, React.CSSProperties> = {
      op:  { background: '#1793d1', color: '#000', border: '2px solid #0d6faa' },
      fn:  { background: '#2a2a2a', color: '#d0d0d0', border: '2px solid #444' },
      eq:  { background: '#4ec94e', color: '#000', border: '2px solid #339933' },
      num: { background: '#1a1a1a', color: '#d0d0d0', border: '2px solid #333' },
    }
    return (
      <button
        key={label}
        onClick={onClick}
        style={{
          ...styles[variant],
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 13,
          cursor: 'pointer',
          borderRadius: 0,
          height: 44,
          transition: 'filter 0.08s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.2)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)' }}
        onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(0.85)' }}
        onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.2)' }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 12,
      gap: 8,
      background: '#0d0d0d',
      fontFamily: "'Share Tech Mono', monospace",
    }}>
      {/* display */}
      <div style={{
        background: '#000',
        border: '2px solid #1793d1',
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        minHeight: 72,
        justifyContent: 'flex-end',
      }}>
        <div style={{ fontSize: 10, color: '#555', height: 16, marginBottom: 2 }}>
          {prev !== null ? `${prev} ${op}` : '\u00a0'}
        </div>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: display.length > 9 ? 20 : display.length > 6 ? 26 : 32,
          color: '#4ec94e',
          letterSpacing: '0.05em',
        }}>
          {display}
        </span>
      </div>

      {/* keys grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, flex: 1 }}>
        {pxBtn('AC',  clear,                    'fn')}
        {pxBtn('+/-', toggleSign,               'fn')}
        {pxBtn('%',   percent,                  'fn')}
        {pxBtn('/',   () => chooseOp('/'),       'op')}
        {pxBtn('7',   () => input('7'))}
        {pxBtn('8',   () => input('8'))}
        {pxBtn('9',   () => input('9'))}
        {pxBtn('*',   () => chooseOp('*'),       'op')}
        {pxBtn('4',   () => input('4'))}
        {pxBtn('5',   () => input('5'))}
        {pxBtn('6',   () => input('6'))}
        {pxBtn('-',   () => chooseOp('-'),       'op')}
        {pxBtn('1',   () => input('1'))}
        {pxBtn('2',   () => input('2'))}
        {pxBtn('3',   () => input('3'))}
        {pxBtn('+',   () => chooseOp('+'),       'op')}

        <button
          onClick={() => input('0')}
          style={{
            gridColumn: 'span 2',
            background: '#1a1a1a', color: '#d0d0d0',
            border: '2px solid #333', borderRadius: 0,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 13, cursor: 'pointer', height: 44,
            textAlign: 'left', paddingLeft: 16,
          }}
        >
          0
        </button>
        {pxBtn('.',   decimal)}
        {pxBtn('=',   calculate,  'eq')}
      </div>

      <p style={{ textAlign: 'center', fontSize: 9, color: '#444', fontFamily: "'Share Tech Mono', monospace" }}>
        # keyboard supported
      </p>
    </div>
  )
}
