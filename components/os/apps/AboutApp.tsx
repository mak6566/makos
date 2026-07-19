export default function AboutApp() {
  return (
    <div style={{
      padding: '14px 16px',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: 12,
      color: '#d0d0d0',
      height: '100%',
      overflowY: 'auto',
      background: '#0d0d0d',
      lineHeight: 1.7,
    }}>
      <p style={{ color: '#555', marginBottom: 12 }}>$ cat about.me</p>

      <div style={{ marginBottom: 16 }}>
        <p style={{ color: '#1793d1', marginBottom: 6 }}>[user]</p>
        <p style={{ color: '#888', marginBottom: 2 }}>&nbsp;&nbsp;name    = student dev</p>
        <p style={{ color: '#888', marginBottom: 2 }}>&nbsp;&nbsp;os      = arch linux (btw)</p>
        <p style={{ color: '#888', marginBottom: 2 }}>&nbsp;&nbsp;editor  = vim (sometimes)</p>
        <p style={{ color: '#888' }}>&nbsp;&nbsp;status  = always learning</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ color: '#1793d1', marginBottom: 6 }}>[bio]</p>
        <p style={{ color: '#888', marginBottom: 2 }}>
          &nbsp;&nbsp;im a student who likes building stuff for the web.
        </p>
        <p style={{ color: '#888' }}>
          &nbsp;&nbsp;made makOS as a school project. not perfect but works.
        </p>
      </div>

      <div>
        <span style={{ color: '#4ec94e' }}>user@makOS</span>
        <span style={{ color: '#888' }}>:~$ </span>
        <span style={{
          display: 'inline-block', width: 8, height: 13,
          background: '#d0d0d0',
          animation: 'blink 0.7s step-end infinite',
          verticalAlign: 'text-bottom',
        }} />
      </div>
    </div>
  )
}
