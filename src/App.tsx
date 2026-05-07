import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import EtchedCrown from './EtchedCrown'
import penguinLogo from './assets/Penguin_logo.svg'
import './index.css'

function App() {
  return (
    <div id="crown-scene">
      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [1.0, 1.2, 5.5], fov: 36 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: '#f2d80a' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, 2, -2]} intensity={0.3} />
          <EtchedCrown />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="ui-overlay">
        {/* Top-left logo */}
        <div className="ui-logo">
          <img src={penguinLogo} alt="Penguin Logo" className="logo-icon-svg" />
        </div>

        {/* Label */}
        <div className="ui-label">
          ETCHED CROWN<br />
          IMPRINT SETTINGS
        </div>

        {/* Top-right settings */}
        <div className="ui-settings">
          <div className="setting-item">
            <span className="setting-label">DENSITY</span>
            <span className="setting-value">4.5691</span>
          </div>
          <div className="setting-item">
            <span className="setting-label">DIRECTION</span>
            <span className="setting-value">11.8172</span>
          </div>
          <div className="setting-item">
            <span className="setting-label">FREQUENCY</span>
            <span className="setting-value">6.6235</span>
          </div>
          <div className="setting-item">
            <span className="setting-label">THICKNESS</span>
            <span className="setting-value">0.8555</span>
          </div>
        </div>

        {/* Bottom text */}
        <div className="ui-bottom">
          INTERACTIVE 3D · DRAG TO ROTATE
        </div>
      </div>
    </div>
  )
}

export default App
