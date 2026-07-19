export default function WelcomeApp() {
  return (
    <div style={{
      padding: '24px 28px',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: 12,
      color: '#d0d0d0',
      lineHeight: 2,
      height: '100%',
      background: '#0d0d0d',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <p style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 15,
        color: '#1793d1',
        marginBottom: 6,
        letterSpacing: '0.05em',
      }}>
        Welcome to makOS
      </p>
      <p style={{ color: '#555', fontSize: 11, marginBottom: 24 }}>
        arch linux inspired browser OS
      </p>

      <div style={{ borderLeft: '2px solid #1793d1', paddingLeft: 14, marginBottom: 20 }}>
        <p style={{ color: '#888', marginBottom: 2 }}>version  <span style={{ color: '#d0d0d0' }}>1.0</span></p>
        <p style={{ color: '#888', marginBottom: 2 }}>kernel   <span style={{ color: '#d0d0d0' }}>react-19.x</span></p>
        <p style={{ color: '#888', marginBottom: 2 }}>shell    <span style={{ color: '#d0d0d0' }}>maksh</span></p>
        <p style={{ color: '#888' }}>uptime   <span style={{ color: '#4ec94e' }}>just booted</span></p>
      </div>

      <p style={{ color: '#555', marginBottom: 2 }}># click icons on the left to open apps</p>
      <p style={{ color: '#555', marginBottom: 2 }}># drag windows by the blue title bar</p>
      <p style={{ color: '#555', marginBottom: 20 }}># try the terminal — type &apos;help&apos;</p>

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
