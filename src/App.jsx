import { useState } from 'react'
import './App.css'

function App() {
  const [counter, setCounter] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const incrementCounter = () => {
    setCounter(prev => prev + 1)
  }

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">DevOps Demo</div>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#pricing">Pricing</a>
              <a href="#aa">future</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Build Faster with 
              <span className="gradient-text"> Modern DevOps</span>
            </h1>
            <p className="hero-description">
              Experience the power of automated CI/CD pipelines, 
              real-time testing, and seamless deployments.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={incrementCounter}>
                � Get Started ({counter})
              </button>
              <button 
                className={`btn ${isSubscribed ? 'btn-subscribed' : 'btn-secondary'}`}
                onClick={handleSubscribe}
              >
                {isSubscribed ? '✅ Subscribed!' : '📧 Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title">Why Choose This Demo?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Optimized build process with modern tooling for rapid development cycles.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Always Tested</h3>
              <p>Automated testing ensures code quality and prevents regressions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Auto Deploy</h3>
              <p>Seamless deployments to Vercel with every successful merge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{counter}</div>
              <div className="stat-label">Interactions</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Test Coverage</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Deploy Steps</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{isSubscribed ? '1' : '0'}</div>
              <div className="stat-label">Subscribers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 DevOps Demo. Built with React, deployed via Vercel.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
