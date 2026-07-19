'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

export interface WindowProps {
  id: string
  title: string
  icon: string
  children: React.ReactNode
  defaultX?: number
  defaultY?: number
  defaultWidth?: number
  defaultHeight?: number
  onClose: (id: string) => void
  onFocus: (id: string) => void
  zIndex: number
  isMinimized?: boolean
  onMinimize: (id: string) => void
}

export default function Window({
  id,
  title,
  icon,
  children,
  defaultX = 100,
  defaultY = 60,
  defaultWidth = 520,
  defaultHeight = 420,
  onClose,
  onFocus,
  zIndex,
  isMinimized = false,
  onMinimize,
}: WindowProps) {
  const [pos, setPos] = useState({ x: defaultX, y: defaultY })
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragging.current = true
      offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
      onFocus(id)
    },
    [id, onFocus, pos.x, pos.y]
  )

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const nx = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - defaultWidth))
      const ny = Math.max(28, Math.min(e.clientY - offset.current.y, window.innerHeight - 60))
      setPos({ x: nx, y: ny })
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [defaultWidth])

  if (isMinimized) return null

  return (
    <div
      className="absolute flex flex-col"
      style={{
        left: pos.x,
        top: pos.y,
        width: defaultWidth,
        height: defaultHeight,
        zIndex,
        background: '#111',
        border: '2px solid #1793d1',
        boxShadow: '4px 4px 0px rgba(0,0,0,0.9)',
        fontFamily: "'Share Tech Mono', monospace",
      }}
      onMouseDown={() => onFocus(id)}
    >
      {/* Title bar */}
      <div
        className="drag-handle flex items-center shrink-0 select-none"
        style={{
          height: 26,
          background: '#1793d1',
          borderBottom: '2px solid #0d6faa',
          padding: '0 6px',
          cursor: 'move',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* window controls */}
        <div className="flex items-center" style={{ gap: 4, marginRight: 8 }}>
          <button
            style={{
              width: 12, height: 12,
              background: '#cc3333',
              border: '1px solid #991111',
              borderRadius: 0,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onClose(id)}
            title="close"
            aria-label="Close window"
          />
          <button
            style={{
              width: 12, height: 12,
              background: '#cc9900',
              border: '1px solid #996600',
              borderRadius: 0,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onMinimize(id)}
            title="minimize"
            aria-label="Minimize window"
          />
          <div style={{ width: 12, height: 12, background: '#333', border: '1px solid #444', flexShrink: 0 }} />
        </div>

        {/* Title */}
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11,
            color: '#000',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {icon} {title}
        </span>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-auto"
        style={{
          userSelect: 'text',
          pointerEvents: 'all',
          position: 'relative',
          zIndex: 1,
          background: '#0d0d0d',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
