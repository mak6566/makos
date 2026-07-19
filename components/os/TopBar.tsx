'use client'

import { useEffect, useState } from 'react'

export default function TopBar() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      setTime(`${hh}:${mm}:${ss}`)
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      setDate(`${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between"
      style={{
        height: 28,
        background: '#0a0a0a',
        borderBottom: '2px solid #1793d1',
        padding: '0 10px',
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      {/* left block */}
      <div className="flex items-center" style={{ gap: 0 }}>
        <div
          style={{
            background: '#1793d1',
            color: '#000',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            padding: '4px 10px',
            lineHeight: 1,
            letterSpacing: '0.05em',
          }}
        >
          makOS
        </div>
        <div
          style={{
            background: '#111',
            color: '#1793d1',
            fontSize: 11,
            padding: '4px 10px',
            borderRight: '1px solid #1793d1',
            lineHeight: 1,
          }}
        >
          arch linux
        </div>
        <div
          style={{
            background: '#111',
            color: '#4ec94e',
            fontSize: 11,
            padding: '4px 10px',
            lineHeight: 1,
          }}
        >
          btw i use arch
        </div>
      </div>

      {/* right block */}
      <div className="flex items-center" style={{ gap: 0 }}>
        <div
          style={{
            background: '#111',
            color: '#888',
            fontSize: 11,
            padding: '4px 10px',
            borderLeft: '1px solid #222',
            lineHeight: 1,
          }}
        >
          {date}
        </div>
        <div
          style={{
            background: '#1793d1',
            color: '#000',
            fontSize: 11,
            fontFamily: "'Share Tech Mono', monospace",
            padding: '4px 10px',
            lineHeight: 1,
            letterSpacing: '0.05em',
            minWidth: 70,
            textAlign: 'center',
          }}
        >
          {time}
        </div>
      </div>
    </header>
  )
}
