import { Component, Suspense, lazy } from 'react'

const Violin3D = lazy(() => import('./Violin3D.jsx'))

class WebGLBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn('Violino 3D indisponível, exibindo alternativa estática.', error)
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function StageFallback() {
  return (
    <div className="hero__stage-fallback" role="img" aria-label="Ilustração de violino dourado">
      <svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <linearGradient id="violinGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8a4a24" />
          </linearGradient>
        </defs>
        <path
          d="M100 10 C130 10 140 40 128 60 C150 75 150 110 130 130 C150 150 150 190 120 205 C150 225 150 270 120 290 C150 310 150 360 100 410 C50 360 50 310 80 290 C50 270 50 225 80 205 C50 190 50 150 70 130 C50 110 50 75 72 60 C60 40 70 10 100 10 Z"
          fill="url(#violinGold)"
          opacity="0.9"
        />
        <rect x="96" y="10" width="8" height="130" fill="#2a1710" />
      </svg>
    </div>
  )
}

export default function HeroStage() {
  return (
    <div className="hero__stage" aria-hidden="false">
      <WebGLBoundary fallback={<StageFallback />}>
        <Suspense fallback={<StageFallback />}>
          <Violin3D />
        </Suspense>
      </WebGLBoundary>
      <div className="hero__stage-hint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 12h8M8 12l3-3M8 12l3 3M16 12l-3-3M16 12l-3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Arraste para girar
      </div>
    </div>
  )
}
