import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import EtchedCrown from './EtchedCrown'
import penguinLogo from './assets/Penguin_logo.svg'
import tomaTeLogo from './assets/logo-vertical.svg'
import './LoopApp.css'

function LoopApp() {
  const LOOP_DURATION = 12 // seconds

  return (
    <div className="loop-container">
      <div className="square-viewport">
        {/* 3D Canvas */}
        <div className="canvas-container-loop">
          <Canvas
            camera={{ position: [1.0, 1.2, 5.5], fov: 36 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: '#f2d80a' }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-3, 2, -2]} intensity={0.3} />
            
            <EtchedCrown loopDuration={LOOP_DURATION} />
          </Canvas>
        </div>

        {/* UI Overlay */}
        <div className="loop-ui">
          <header className="loop-header">
            <div className="loop-header-left">
              <img src={penguinLogo} alt="Penguin Logo" className="loop-logo-penguin" />
              <span className="loop-collab-x">×</span>
              <img src={tomaTeLogo} alt="Toma-te Logo" className="loop-logo-tomate" />
            </div>
            
            <div className="loop-header-right">
              <div className="loop-date-label">RELEASED</div>
              <div className="loop-date">OCT 2024</div>
            </div>
          </header>

          <div className="loop-footer-center">
            <div className="loop-series">The Penguin Weird Fiction Collection</div>
            <h1 className="loop-title">the king in yellow</h1>
            <div className="loop-author">Robert W. Chambers</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoopApp
