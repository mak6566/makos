'use client'

import { useState } from 'react'

export default function NotesApp() {
  const [text, setText] = useState('')

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0d0d0d',
      fontFamily: "'Share Tech Mono', monospace",
    }}>
      {/* toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#111',
        borderBottom: '1px solid #222',
        padding: '4px 10px',
        fontSize: 10,
        color: '#555',
        flexShrink: 0,
      }}>
        <span>notes.txt — unsaved</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setText('')}
            style={{
              background: 'none',
              border: '1px solid #333',
              color: '#555',
              fontSize: 10,
              fontFamily: "'Share Tech Mono', monospace",
              padding: '1px 8px',
              cursor: 'pointer',
              borderRadius: 0,
            }}
            onMouseEnter={(e) => { (e.currentTarget).style.color = '#cc3333'; (e.currentTarget).style.borderColor = '#cc3333' }}
            onMouseLeave={(e) => { (e.currentTarget).style.color = '#555'; (e.currentTarget).style.borderColor = '#333' }}
          >
            clear
          </button>
          <button
            onClick={() => {
              const blob = new Blob([text], { type: 'text/plain' })
              const a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = 'notes.txt'
              a.click()
            }}
            style={{
              background: 'none',
              border: '1px solid #1793d1',
              color: '#1793d1',
              fontSize: 10,
              fontFamily: "'Share Tech Mono', monospace",
              padding: '1px 8px',
              cursor: 'pointer',
              borderRadius: 0,
            }}
            onMouseEnter={(e) => { (e.currentTarget).style.background = '#1793d1'; (e.currentTarget).style.color = '#000' }}
            onMouseLeave={(e) => { (e.currentTarget).style.background = 'none'; (e.currentTarget).style.color = '#1793d1' }}
          >
            save .txt
          </button>
        </div>
      </div>

      {/* editor */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={'# start typing...\n# this is notes.txt\n# nothing saves to a database, its just for now'}
        spellCheck={false}
        style={{
          flex: 1,
          background: '#0d0d0d',
          color: '#d0d0d0',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 12,
          lineHeight: 1.8,
          padding: '12px 14px',
          caretColor: '#1793d1',
        }}
      />

      {/* status bar */}
      <div style={{
        background: '#111',
        borderTop: '1px solid #222',
        padding: '2px 10px',
        fontSize: 9,
        color: '#444',
        display: 'flex',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span>ln {text.split('\n').length} | col {(text.split('\n').at(-1) ?? '').length + 1}</span>
        <span>{text.length} chars</span>
      </div>
    </div>
  )
}
