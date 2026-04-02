import { useState } from 'react'
import './App.css'
import HealthCheck from './components/HealthCheck'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [clicked, setClicked] = useState(false)
  const [logs, setLogs] = useState([])

  const addLog = (message) => {
    const timestamp = new Date().toISOString()
    setLogs(prev => [...prev.slice(-4), { timestamp, message }])
  }

  const handleButtonClick = () => {
    const newState = !clicked
    setClicked(newState)
    addLog(`Button ${newState ? 'clicked' : 'reset'} - CI/CD pipeline ${newState ? 'triggered' : 'reset'} 🚀`)
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>{import.meta.env.VITE_APP_NAME || 'DevOps Demo'}</h1>
          <p className="version">Version: {import.meta.env.VITE_APP_VERSION || '1.0.0'}</p>
        </header>
        
        <main className="main-content">
          <section className="demo-section">
            <h2>Interactive Demo</h2>
            <p className="status-text">
              {clicked ? 'Button clicked! CI/CD pipeline is running 🚀' : 'Click the button to trigger a demo action'}
            </p>
            <button className="demo-btn" onClick={handleButtonClick}>
              {clicked ? 'Reset' : 'Run Demo'}
            </button>
          </section>

          <section className="monitoring-section">
            <HealthCheck />
          </section>

          <section className="logs-section">
            <h3>Activity Logs</h3>
            <div className="logs">
              {logs.length === 0 ? (
                <p>No activity yet...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="log-entry">
                    <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
