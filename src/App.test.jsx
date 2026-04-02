import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App Component', () => {
  it('renders the main landing page', () => {
    render(<App />)
    
    // Check if header exists
    expect(screen.getByText('DevOps Demo')).toBeInTheDocument()
    
    // Check if hero section renders
    expect(screen.getByText(/Build Faster with/)).toBeInTheDocument()
    expect(screen.getByText(/Modern DevOps/)).toBeInTheDocument()
  })

  it('renders the "Get Started" button', () => {
    render(<App />)
    
    // Find button by text content (without emoji)
    const getStartedButton = screen.getByText(/Get Started/)
    expect(getStartedButton).toBeInTheDocument()
  })

  it('renders the "Subscribe" button', () => {
    render(<App />)
    
    // Find button specifically (not the stats label)
    const subscribeButton = screen.getByRole('button', { name: /Subscribe/ })
    expect(subscribeButton).toBeInTheDocument()
  })

  it('increments counter when Get Started button is clicked', () => {
    render(<App />)
    
    const getStartedButton = screen.getByText(/Get Started/)
    
    // Initial state
    expect(getStartedButton).toHaveTextContent('Get Started (0)')
    
    // Click once
    fireEvent.click(getStartedButton)
    expect(getStartedButton).toHaveTextContent('Get Started (1)')
  })

  it('toggles subscription state when Subscribe button is clicked', () => {
    render(<App />)
    
    // Find button specifically (not the stats label)
    const subscribeButton = screen.getByRole('button', { name: /Subscribe/ })
    
    // Initial state
    expect(subscribeButton).toHaveTextContent('Subscribe')
    
    // Click to subscribe
    fireEvent.click(subscribeButton)
    expect(subscribeButton).toHaveTextContent('Subscribed!')
  })

  it('renders features section', () => {
    render(<App />)
    
    expect(screen.getByText('Why Choose This Demo?')).toBeInTheDocument()
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument()
    expect(screen.getByText('Always Tested')).toBeInTheDocument()
    expect(screen.getByText('Auto Deploy')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<App />)
    
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<App />)
    
    expect(screen.getByText(/Built with React, deployed via Vercel/)).toBeInTheDocument()
  })
})
