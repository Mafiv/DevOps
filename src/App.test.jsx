import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the DevOps Demo title', () => {
    render(<App />)
    expect(screen.getByText('DevOps Demo')).toBeInTheDocument()
  })

  it('shows initial prompt text before clicking', () => {
    render(<App />)
    expect(screen.getByText('Click the button to trigger a demo action')).toBeInTheDocument()
  })

  it('changes text when the button is clicked', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /run demo/i })
    fireEvent.click(button)
    expect(screen.getByText('Button clicked! CI/CD pipeline is running 🚀')).toBeInTheDocument()
  })

  it('resets text when button is clicked again', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /run demo/i })
    fireEvent.click(button)
    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)
    expect(screen.getByText('Click the button to trigger a demo action')).toBeInTheDocument()
  })
})
