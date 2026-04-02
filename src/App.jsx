import { useState } from 'react'
import './App.css'

function App() {
  const [clicked, setClicked] = useState(false)

  return (
    <div className="app">
      <h1>DevOps Demo</h1>
      <p className="status-text">
        {clicked ? 'Button clicked! CI/CD pipeline is running 🚀' : 'Click the button to trigger a demo action'}
      </p>
      <button className="demo-btn" onClick={() => setClicked((prev) => !prev)}>
        {clicked ? 'Reset' : 'Run Demo'}
      </button>
    </div>
  )
}

export default App
