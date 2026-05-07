import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import EtchedCrown from './EtchedCrown'
import penguinLogo from './assets/Penguin_logo.svg'
import './index.css'

function App() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = window.scrollY / totalHeight
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div id="crown-scene">
      {/* 3D Canvas - Fixed in background */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [1.0, 1.2, 5.5], fov: 36 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: '#f2d80a' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, 2, -2]} intensity={0.3} />
          
          {/* The crown moves up more slowly based on scrollProgress */}
          <group position={[0, scrollProgress * 8, 0]}>
            <EtchedCrown />
          </group>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>


      {/* UI Overlay - Fixed */}
      <div className="ui-overlay">
        <header className="ui-header">
          <div className="header-left">
            <div className="ui-logo">
              <img src={penguinLogo} alt="Penguin Logo" className="logo-icon-svg" />
            </div>
            <div className="vertical-divider"></div>
            <div className="ui-label-brand">
              Penguin<br />
              Random House<br />
              Grupo Editorial
            </div>
          </div>
          
          {/* Center text - Fades out */}
          <div 
            className="ui-top-center"
            style={{ 
              opacity: Math.max(0, 1 - scrollProgress * 15),
              pointerEvents: scrollProgress > 0.05 ? 'none' : 'auto'
            }}
          >
            Interactive 3D · Drag to rotate
          </div>
        </header>

        {/* Bottom-left indicator - Fades out */}
        <div 
          className="ui-bottom-left"
          style={{ 
            opacity: Math.max(0, 1 - scrollProgress * 15),
            pointerEvents: scrollProgress > 0.05 ? 'none' : 'auto'
          }}
        >
          <span className="parenthesis">(</span>
          <span className="indicator-text">Try scroll</span>
          <span className="parenthesis">)</span>
          <span className="arrow-down">↓</span>
        </div>
      </div>


      {/* Native Scroll Content */}
      <div className="scroll-content">
        <div className="scroll-spacer" style={{ height: '100vh' }}></div>
        <div className="editorial-section">
          <div className="editorial-title-wrapper">
            <h1 className="editorial-title">
              the king<br />
              <span className="indent-title">in yell<span className="special-o">o</span>w</span>
            </h1>
          </div>
          <div className="quote-container">
            <span className="quote-parenthesis">(</span>
            <p className="editorial-quote">
              Fear became for me a living thing,<br />
              a breathing companion beside the throne<br />
              of the King in Yellow.
            </p>
            <span className="quote-parenthesis">)</span>
          </div>
        </div>
        <div className="scroll-spacer" style={{ height: '100vh' }}></div>
      </div>
    </div>
  )
}



export default App
