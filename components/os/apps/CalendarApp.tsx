'use client'

import { useState } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function CalendarApp() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // pad to full rows
  while (cells.length % 7 !== 0) cells.push(null)

  const isToday = (d: number | null) =>
    d !== null &&
    d === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear()

  const btnStyle: React.CSSProperties = {
    background: 'none',
    border: '1px solid #333',
    color: '#888',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11,
    padding: '2px 10px',
    cursor: 'pointer',
    borderRadius: 0,
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0d0d0d',
      fontFamily: "'Share Tech Mono', monospace",
      padding: '14px 16px',
      fontSize: 12,
    }}>
      {/* header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <button
          style={btnStyle}
          onClick={prevMonth}
          onMouseEnter={(e) => { (e.currentTarget).style.borderColor = '#1793d1'; (e.currentTarget).style.color = '#1793d1' }}
          onMouseLeave={(e) => { (e.currentTarget).style.borderColor = '#333'; (e.currentTarget).style.color = '#888' }}
        >
          &lt; prev
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#1793d1', fontSize: 12, letterSpacing: '0.05em' }}>
            {MONTHS[viewMonth]}
          </div>
          <div style={{ color: '#555', fontSize: 10, marginTop: 2 }}>{viewYear}</div>
        </div>

        <button
          style={btnStyle}
          onClick={nextMonth}
          onMouseEnter={(e) => { (e.currentTarget).style.borderColor = '#1793d1'; (e.currentTarget).style.color = '#1793d1' }}
          onMouseLeave={(e) => { (e.currentTarget).style.borderColor = '#333'; (e.currentTarget).style.color = '#888' }}
        >
          next &gt;
        </button>
      </div>

      {/* day headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        marginBottom: 4,
        borderBottom: '1px solid #222',
        paddingBottom: 4,
      }}>
        {DAYS.map((d) => (
          <div key={d} style={{ textAlign: 'center', color: '#555', fontSize: 10 }}>
            {d}
          </div>
        ))}
      </div>

      {/* day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, flex: 1 }}>
        {cells.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              padding: '4px 0',
              fontSize: 11,
              color: d === null ? 'transparent' : isToday(d) ? '#000' : '#888',
              background: isToday(d) ? '#1793d1' : 'transparent',
              border: isToday(d) ? 'none' : '1px solid transparent',
              cursor: d ? 'default' : 'default',
              lineHeight: 1.6,
            }}
          >
            {d ?? ''}
          </div>
        ))}
      </div>

      {/* footer */}
      <div style={{
        marginTop: 10,
        borderTop: '1px solid #222',
        paddingTop: 8,
        fontSize: 10,
        color: '#555',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>today: {today.toLocaleDateString('en-GB')}</span>
        <button
          style={{ ...btnStyle, fontSize: 10, padding: '1px 8px' }}
          onClick={() => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()) }}
          onMouseEnter={(e) => { (e.currentTarget).style.borderColor = '#1793d1'; (e.currentTarget).style.color = '#1793d1' }}
          onMouseLeave={(e) => { (e.currentTarget).style.borderColor = '#333'; (e.currentTarget).style.color = '#888' }}
        >
          jump to today
        </button>
      </div>
    </div>
  )
}
