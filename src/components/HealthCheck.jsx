import { useState, useEffect } from 'react'

const HealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState('checking')
  const [lastCheck, setLastCheck] = useState(null)
  const [metrics, setMetrics] = useState({
    uptime: 0,
    memory: 0,
    clicks: 0
  })

  useEffect(() => {
    const checkHealth = () => {
      const now = new Date().toISOString()
      const navigationEntries = window.performance?.getEntriesByType('navigation')
      const navEntry = navigationEntries?.[0]
      
      setHealthStatus('healthy')
      setLastCheck(now)
      setMetrics(prev => ({
        ...prev,
        uptime: navEntry ? navEntry.loadEventEnd - navEntry.loadEventStart : 0,
        memory: window.performance?.memory ? window.performance.memory.usedJSHeapSize : 0
      }))
    }

    checkHealth()
    const interval = setInterval(checkHealth, import.meta.env.VITE_HEALTH_CHECK_INTERVAL || 30000)

    return () => clearInterval(interval)
  }, [])

  const incrementClicks = () => {
    setMetrics(prev => ({ ...prev, clicks: prev.clicks + 1 }))
  }

  return (
    <div className="health-check">
      <h3>System Health</h3>
      <div className="health-status">
        <span className={`status-indicator ${healthStatus}`}></span>
        <span>Status: {healthStatus}</span>
      </div>
      <div className="metrics">
        <p>Last Check: {lastCheck ? new Date(lastCheck).toLocaleTimeString() : 'Never'}</p>
        <p>Uptime: {metrics.uptime.toFixed(2)}ms</p>
        <p>Memory: {(metrics.memory / 1024 / 1024).toFixed(2)} MB</p>
        <p>User Interactions: {metrics.clicks}</p>
      </div>
      <button onClick={incrementClicks} className="metric-btn">
        Simulate User Action
      </button>
    </div>
  )
}

export default HealthCheck
