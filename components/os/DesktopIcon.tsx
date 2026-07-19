'use client'

interface DesktopIconProps {
  icon: string
  label: string
  onClick: () => void
  isOpen?: boolean
}

export default function DesktopIcon({ icon, label, onClick, isOpen }: DesktopIconProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        background: isOpen ? 'rgba(23,147,209,0.2)' : 'transparent',
        border: isOpen ? '1px solid #1793d1' : '1px solid transparent',
        padding: '6px 6px 4px 6px',
        cursor: 'pointer',
        width: 62,
        fontFamily: "'Share Tech Mono', monospace",
        borderRadius: 0,
      }}
      onMouseEnter={(e) => {
        if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(23,147,209,0.1)'
      }}
      onMouseLeave={(e) => {
        if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
      }}
    >
      <span style={{ fontSize: 26, lineHeight: 1, display: 'block' }}>{icon}</span>
      <span
        style={{
          fontSize: 8,
          color: '#d0d0d0',
          textAlign: 'center',
          lineHeight: 1.4,
          textShadow: '1px 1px 0 #000, -1px -1px 0 #000',
          fontFamily: "'Share Tech Mono', monospace",
          wordBreak: 'break-word',
          maxWidth: '100%',
        }}
      >
        {label}
      </span>
      {isOpen && (
        <div style={{ width: 4, height: 4, background: '#1793d1', marginTop: 1 }} />
      )}
    </button>
  )
}
