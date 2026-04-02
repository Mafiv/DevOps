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
    
    // Check if description exists
    expect(screen.getByText(/Experience the power of automated/)).toBeInTheDocument()
  })

  it('renders the "Get Started" button with counter', () => {
    render(<App />)
    
    const getStartedButton = screen.getByRole('button', { name: /🚀 Get Started/i })
    expect(getStartedButton).toBeInTheDocument()
    expect(getStartedButton).toHaveTextContent('🚀 Get Started (0)')
  })

  it('renders the "Subscribe" button', () => {
    render(<App />)
    
    const subscribeButton = screen.getByRole('button', { name: /📧 Subscribe/i })
    expect(subscribeButton).toBeInTheDocument()
  })

  it('increments counter when Get Started button is clicked', () => {
    render(<App />)
    
    const getStartedButton = screen.getByRole('button', { name: /🚀 Get Started/i })
    
    // Initial state
    expect(getStartedButton).toHaveTextContent('🚀 Get Started (0)')
    
    // Click once
    fireEvent.click(getStartedButton)
    expect(getStartedButton).toHaveTextContent('🚀 Get Started (1)')
    
    // Click again
    fireEvent.click(getStartedButton)
    expect(getStartedButton).toHaveTextContent('🚀 Get Started (2)')
  })

  it('toggles subscription state when Subscribe button is clicked', () => {
    render(<App />)
    
    const subscribeButton = screen.getByRole('button', { name: /📧 Subscribe/i })
    
    // Initial state
    expect(subscribeButton).toHaveTextContent('📧 Subscribe')
    
    // Click to subscribe
    fireEvent.click(subscribeButton)
    expect(subscribeButton).toHaveTextContent('✅ Subscribed!')
    
    // Click to unsubscribe
    fireEvent.click(subscribeButton)
    expect(subscribeButton).toHaveTextContent('📧 Subscribe')
  })

  it('displays correct stats based on counter and subscription state', () => {
    render(<App />)
    
    // Initial stats
    expect(screen.getByText('0')).toBeInTheDocument() // Interactions
    expect(screen.getByText('0')).toBeInTheDocument() // Subscribers
    
    const getStartedButton = screen.getByRole('button', { name: /🚀 Get Started/i })
    const subscribeButton = screen.getByRole('button', { name: /📧 Subscribe/i })
    
    // Increment counter
    fireEvent.click(getStartedButton)
    expect(screen.getByText('1')).toBeInTheDocument() // Interactions should be 1
    
    // Subscribe
    fireEvent.click(subscribeButton)
    expect(screen.getByText('1')).toBeInTheDocument() // Subscribers should be 1
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

  it('renders CI/CD pipeline visualization', () => {
    render(<App />)
    
    expect(screen.getByText('CI/CD Pipeline')).toBeInTheDocument()
    expect(screen.getByText('Build')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Deploy')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<App />)
    
    expect(screen.getByText(/Built with React, deployed via Vercel/)).toBeInTheDocument()
  })
})
