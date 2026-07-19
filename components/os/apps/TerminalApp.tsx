'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Line {
  type: 'input' | 'output' | 'error' | 'info'
  text: string
}

const FS: Record<string, string> = {
  'welcome.txt': 'Welcome to makOS. btw i use arch.',
  'about.me': 'name=student dev | os=arch linux | status=always learning',
  'readme.md': '# makOS\na personal OS running in your browser.\nbuilt with react + nextjs.',
}

function runCommand(raw: string): Line[] {
  const parts = raw.trim().split(/\s+/)
  const cmd = parts[0]
  const args = parts.slice(1)

  switch (cmd) {
    case '':
      return []

    case 'help':
      return [
        { type: 'info', text: 'available commands:' },
        { type: 'output', text: '  help          show this list' },
        { type: 'output', text: '  ls            list files' },
        { type: 'output', text: '  cat <file>    print file contents' },
        { type: 'output', text: '  echo <text>   print text' },
        { type: 'output', text: '  whoami        who are you' },
        { type: 'output', text: '  uname -a      system info' },
        { type: 'output', text: '  date          current date' },
        { type: 'output', text: '  uptime        uptime info' },
        { type: 'output', text: '  clear         clear terminal' },
        { type: 'output', text: '  neofetch      system info dump' },
        { type: 'output', text: '  pwd           print working dir' },
        { type: 'output', text: '  arch          btw' },
      ]

    case 'ls':
      return [
        { type: 'output', text: Object.keys(FS).join('  ') },
      ]

    case 'cat': {
      if (!args[0]) return [{ type: 'error', text: 'cat: missing operand' }]
      const content = FS[args[0]]
      if (!content) return [{ type: 'error', text: `cat: ${args[0]}: No such file or directory` }]
      return [{ type: 'output', text: content }]
    }

    case 'echo':
      return [{ type: 'output', text: args.join(' ') || '' }]

    case 'whoami':
      return [{ type: 'output', text: 'user' }]

    case 'pwd':
      return [{ type: 'output', text: '/home/user' }]

    case 'uname': {
      const full = 'Linux makOS 6.9.1-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux'
      return [{ type: 'output', text: args.includes('-a') ? full : 'Linux' }]
    }

    case 'date':
      return [{ type: 'output', text: new Date().toString() }]

    case 'uptime':
      return [{ type: 'output', text: 'up 0 min, 1 user, load average: 0.00, 0.00, 0.00' }]

    case 'arch':
      return [
        { type: 'info', text: 'btw i use arch' },
      ]

    case 'neofetch':
      return [
        { type: 'info',   text: '      /\\       user@makOS' },
        { type: 'info',   text: '     /  \\      ----------' },
        { type: 'info',   text: '    /\\   \\     OS: makOS 1.0 (Arch-inspired)' },
        { type: 'info',   text: '   /  __  \\    Host: Browser' },
        { type: 'info',   text: '  / /    \\ \\   Kernel: react-19.x' },
        { type: 'info',   text: ' /_/      \\_\\  Shell: maksh' },
        { type: 'output', text: '              WM: Pixel WM' },
        { type: 'output', text: '              Theme: Arch Blue' },
        { type: 'output', text: '              Terminal: makTerm' },
      ]

    case 'clear':
      return [{ type: 'info', text: '__CLEAR__' }]

    default:
      return [{ type: 'error', text: `${cmd}: command not found. type 'help' for commands.` }]
  }
}

export default function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([
    { type: 'info', text: 'makOS terminal v1.0 — type \'help\' for commands' },
    { type: 'output', text: '' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [lines])

  const submit = useCallback(() => {
    const cmd = input.trim()
    const inputLine: Line = { type: 'input', text: `user@makOS:~$ ${input}` }
    const result = runCommand(cmd)

    if (result.length === 1 && result[0].text === '__CLEAR__') {
      setLines([])
    } else {
      setLines((prev) => [...prev, inputLine, ...result])
    }

    if (cmd) {
      setHistory((prev) => [cmd, ...prev.slice(0, 49)])
    }
    setHistIdx(-1)
    setInput('')
  }, [input])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'Enter') {
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx - 1
      if (next < 0) { setHistIdx(-1); setInput('') }
      else { setHistIdx(next); setInput(history[next]) }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const partial = input.trim()
      if (!partial) return
      const match = Object.keys(FS).find((f) => f.startsWith(partial))
      if (match) setInput((prev) => prev.replace(partial, match))
    }
  }

  const colorMap: Record<Line['type'], string> = {
    input: '#888',
    output: '#d0d0d0',
    error: '#cc3333',
    info: '#1793d1',
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#080808',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 12,
        cursor: 'text',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* output area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: colorMap[line.type], lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {line.text || '\u00a0'}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* input row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid #1a1a1a',
        padding: '6px 12px',
        gap: 6,
        background: '#0a0a0a',
        flexShrink: 0,
      }}>
        <span style={{ color: '#4ec94e', whiteSpace: 'nowrap' }}>user@makOS</span>
        <span style={{ color: '#888' }}>:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          spellCheck={false}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#d0d0d0',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 12,
            caretColor: '#1793d1',
          }}
        />
      </div>
    </div>
  )
}
