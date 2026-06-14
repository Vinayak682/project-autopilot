import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

describe('Hero Component', () => {
  it('renders hero title correctly', () => {
    render(<Hero />)
    expect(screen.getByText(/Autopilot Your/i)).toBeInTheDocument()
    expect(screen.getByText(/Supply Chain/i)).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<Hero />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('displays hero statistics', () => {
    render(<Hero />)
    expect(screen.getByText('99.7%')).toBeInTheDocument()
    expect(screen.getByText('94%')).toBeInTheDocument()
    expect(screen.getByText(/<50ms/i)).toBeInTheDocument()
  })

  it('renders with correct heading hierarchy', () => {
    render(<Hero />)
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('contains AI-powered supply chain text', () => {
    render(<Hero />)
    expect(screen.getByText(/AI-powered supply chain/i)).toBeInTheDocument()
  })
})
