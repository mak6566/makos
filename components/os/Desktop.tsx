'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import TopBar from './TopBar'
import DesktopIcon from './DesktopIcon'
import Window from './Window'
import WelcomeApp from './apps/WelcomeApp'
import CalculatorApp from './apps/CalculatorApp'
import AboutApp from './apps/AboutApp'
import SnakeApp from './apps/SnakeApp'
import NotesApp from './apps/NotesApp'
import TerminalApp from './apps/TerminalApp'
import CalendarApp from './apps/CalendarApp'

interface AppDef {
  id: string
  title: string
  icon: string
  label: string
  defaultWidth?: number
  defaultHeight?: number
  defaultX?: number
  defaultY?: number
}

const APPS: AppDef[] = [
  {
    id: 'welcome',
    title: 'welcome.txt',
    icon: '📄',
    label: 'welcome.txt',
    defaultWidth: 460,
    defaultHeight: 320,
    defaultX: 120,
    defaultY: 60,
  },
  {
    id: 'calculator',
    title: 'calc',
    icon: '🔢',
    label: 'calc',
    defaultWidth: 260,
    defaultHeight: 400,
    defaultX: 400,
    defaultY: 70,
  },
  {
    id: 'about',
    title: 'about.me',
    icon: '👾',
    label: 'about.me',
    defaultWidth: 400,
    defaultHeight: 430,
    defaultX: 220,
    defaultY: 80,
  },
  {
    id: 'snake',
    title: 'snake.exe',
    icon: '🐍',
    label: 'snake.exe',
    defaultWidth: 360,
    defaultHeight: 430,
    defaultX: 300,
    defaultY: 65,
  },
  {
    id: 'notes',
    title: 'notes.txt',
    icon: '📝',
    label: 'notes.txt',
    defaultWidth: 420,
    defaultHeight: 360,
    defaultX: 160,
    defaultY: 80,
  },
  {
    id: 'terminal',
    title: 'terminal',
    icon: '>_',
    label: 'terminal',
    defaultWidth: 520,
    defaultHeight: 360,
    defaultX: 140,
    defaultY: 70,
  },
  {
    id: 'calendar',
    title: 'cal',
    icon: '📅',
    label: 'cal',
    defaultWidth: 300,
    defaultHeight: 360,
    defaultX: 200,
    defaultY: 80,
  },
]

interface WinState {
  id: string
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
}

let zCounter = 10

// -- fake boot lines --
const BOOT_LINES = [
  { text: 'BIOS v2.1.0 — POST OK', color: '#888', delay: 0 },
  { text: 'Initializing kernel...', color: '#888', delay: 120 },
  { text: '[    0.000000] Booting Linux 6.9.1-arch1-1', color: '#4ec94e', delay: 240 },
  { text: '[    0.142338] ACPI: Core revision 20231218', color: '#4ec94e', delay: 360 },
  { text: '[    0.318774] PCI: Using configuration type 1', color: '#4ec94e', delay: 480 },
  { text: '[    0.501290] clocksource: tsc-early', color: '#4ec94e', delay: 600 },
  { text: '[    0.722100] SCSI subsystem initialized', color: '#4ec94e', delay: 720 },
  { text: '[    0.901445] NET: Registered PF_INET6 protocol family', color: '#4ec94e', delay: 840 },
  { text: '[    1.204100] Loading modules...', color: '#4ec94e', delay: 960 },
  { text: '[    1.488200] systemd[1]: Inserted module snd_hda_intel', color: '#4ec94e', delay: 1080 },
  { text: '', color: '#888', delay: 1180 },
  { text: 'Starting makOS...', color: '#1793d1', delay: 1280 },
  { text: '[  OK  ] Started Network Manager.', color: '#4ec94e', delay: 1400 },
  { text: '[  OK  ] Started D-Bus System Message Bus.', color: '#4ec94e', delay: 1520 },
  { text: '[  OK  ] Reached target Graphical Interface.', color: '#4ec94e', delay: 1640 },
  { text: '', color: '#888', delay: 1720 },
  { text: 'Welcome to makOS — btw i use arch', color: '#1793d1', delay: 1820 },
]

function BootScreen({ onDone }: { onDone: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [done, setDone] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisibleCount(i + 1)
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      }, line.delay))
    })

    // fade out after last line
    const lastDelay = BOOT_LINES[BOOT_LINES.length - 1].delay
    timers.push(setTimeout(() => setDone(true), lastDelay + 600))
    timers.push(setTimeout(() => onDone(), lastDelay + 1000))

    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col justify-end"
      style={{
        background: '#000',
        opacity: done ? 0 : 1,
        transition: done ? 'opacity 0.4s ease' : 'none',
        padding: '20px 24px',
      }}
    >
      <div
        ref={containerRef}
        style={{
          overflowY: 'auto',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 12,
              color: line.color,
              lineHeight: 1.6,
              animation: 'bootSlideUp 0.08s ease-out both',
            }}
          >
            {line.text || '\u00a0'}
          </div>
        ))}
        {visibleCount > 0 && visibleCount < BOOT_LINES.length && (
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 14,
              background: '#d0d0d0',
              animation: 'blink 0.7s step-end infinite',
              marginTop: 2,
            }}
          />
        )}
      </div>
    </div>
  )
}

// -- greeting modal --
function GreetingModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111',
          border: '2px solid #1793d1',
          boxShadow: '6px 6px 0 #000',
          padding: '24px 28px',
          maxWidth: 380,
          width: '90%',
          fontFamily: "'Share Tech Mono', monospace",
          animation: 'pixelIn 0.2s ease-out both',
        }}
      >
        <div
          style={{
            background: '#1793d1',
            color: '#000',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            padding: '6px 10px',
            marginBottom: 16,
            letterSpacing: '0.04em',
          }}
        >
          makOS — system ready
        </div>

        <p style={{ color: '#4ec94e', fontSize: 12, marginBottom: 8, lineHeight: 1.6 }}>
          $ whoami
        </p>
        <p style={{ color: '#d0d0d0', fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
          &gt; welcome to makOS<br />
          &gt; click icons on the left to open apps<br />
          &gt; drag windows by the blue title bar<br />
          &gt; try the terminal — type &apos;help&apos;
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {['welcome.txt', 'calc', 'about.me', 'snake.exe', 'notes.txt', 'terminal', 'cal'].map((t) => (
            <span
              key={t}
              style={{
                background: '#0d0d0d',
                border: '1px solid #1793d1',
                color: '#1793d1',
                fontSize: 10,
                padding: '2px 8px',
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <button
          onClick={onClose}
          className="pixel-btn"
          style={{ width: '100%', padding: '8px', fontSize: 11 }}
        >
          [ press enter to continue ]
        </button>
      </div>
    </div>
  )
}

export default function Desktop() {
  const [booting, setBooting] = useState(true)
  const [showGreeting, setShowGreeting] = useState(false)

  const [windows, setWindows] = useState<WinState[]>(
    APPS.map((app) => ({ id: app.id, isOpen: false, isMinimized: false, zIndex: 10 }))
  )

  const handleBootDone = useCallback(() => {
    setBooting(false)
    setShowGreeting(true)
  }, [])

  const openApp = useCallback((id: string) => {
    zCounter++
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: zCounter } : w
      )
    )
  }, [])

  const closeApp = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)))
  }, [])

  const minimizeApp = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)))
  }, [])

  const focusApp = useCallback((id: string) => {
    zCounter++
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: zCounter } : w)))
  }, [])

  const getContent = (id: string) => {
    switch (id) {
      case 'welcome':    return <WelcomeApp />
      case 'calculator': return <CalculatorApp />
      case 'about':      return <AboutApp />
      case 'snake':      return <SnakeApp />
      case 'notes':      return <NotesApp />
      case 'terminal':   return <TerminalApp />
      case 'calendar':   return <CalendarApp />
      default:           return null
    }
  }

  const minimized = windows.filter((w) => w.isMinimized)

  return (
    <>
      {booting && <BootScreen onDone={handleBootDone} />}
      {showGreeting && <GreetingModal onClose={() => setShowGreeting(false)} />}

   <main
        className="fixed inset-0 overflow-hidden"
        style={{
          // Použijeme import.meta.env.BASE_URL namiesto process.env...
          backgroundImage: `url('${import.meta.env.BASE_URL}wallpaper.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* dark overlay so text stays readable */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)' }} />

        <TopBar />

        {/* desktop icons — left column */}
        <aside
          className="absolute left-2 flex flex-col z-10"
          style={{ top: 36, gap: 2 }}
          aria-label="Desktop icons"
        >
          {APPS.map((app) => {
            const ws = windows.find((w) => w.id === app.id)
            return (
              <DesktopIcon
                key={app.id}
                icon={app.icon}
                label={app.label}
                onClick={() => openApp(app.id)}
                isOpen={ws?.isOpen && !ws?.isMinimized}
              />
            )
          })}
        </aside>

        {/* windows */}
        {APPS.map((app) => {
          const ws = windows.find((w) => w.id === app.id)
          if (!ws?.isOpen) return null
          return (
            <Window
              key={app.id}
              id={app.id}
              title={app.title}
              icon={app.icon}
              defaultX={app.defaultX}
              defaultY={app.defaultY}
              defaultWidth={app.defaultWidth}
              defaultHeight={app.defaultHeight}
              onClose={closeApp}
              onFocus={focusApp}
              onMinimize={minimizeApp}
              zIndex={ws.zIndex}
              isMinimized={ws.isMinimized}
            >
              {getContent(app.id)}
            </Window>
          )
        })}

        {/* minimized dock */}
        {minimized.length > 0 && (
          <nav
            className="absolute bottom-0 left-0 right-0 flex items-center z-[9997]"
            style={{
              background: '#0a0a0a',
              borderTop: '2px solid #1793d1',
              padding: '4px 10px',
              gap: 4,
              height: 36,
            }}
            aria-label="Minimized apps"
          >
            <span style={{ color: '#555', fontSize: 10, fontFamily: "'Share Tech Mono', monospace", marginRight: 6 }}>
              minimized:
            </span>
            {minimized.map((w) => {
              const app = APPS.find((a) => a.id === w.id)!
              return (
                <button
                  key={w.id}
                  onClick={() => openApp(w.id)}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #1793d1',
                    color: '#d0d0d0',
                    fontSize: 10,
                    fontFamily: "'Share Tech Mono', monospace",
                    padding: '2px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    borderRadius: 0,
                  }}
                  title={`Restore ${app.title}`}
                >
                  <span>{app.icon}</span>
                  <span>{app.title}</span>
                </button>
              )
            })}
          </nav>
        )}
      </main>
    </>
  )
}
