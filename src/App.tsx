import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import EtchedCrown from './EtchedCrown'
import penguinLogo from './assets/Penguin_logo.svg'
import bookCover from './assets/book_cover.jpg'
import collectionImage from './assets/collection.jpg'
import tomaTeLogo from './assets/logo-vertical.svg'
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
              Editorial Group
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
        <div className="scroll-spacer" style={{ height: '140vh' }}></div>
        
        {/* Title and Quote Section (Fixed height) */}
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

        {/* Detailed Text Section (Natural height) */}
        <div className="editorial-details">
          <p className="details-lead">
            Step beyond the veil and enter the world of The King in Yellow — the legendary collection of strange tales that shaped modern cosmic horror.
          </p>
          
          <p>
            Originally written by Robert W. Chambers and first published in 1895, The King in Yellow became one of the most influential works in weird fiction history, inspiring generations of writers, artists, filmmakers, and occult horror alike. Long before modern psychological horror existed, Chambers created a universe haunted by madness, forbidden knowledge, and the shadow of the mysterious city of Carcosa.
          </p>

          <p>
            At the center of the stories lies a forbidden play — a text so disturbing that those who read it slowly descend into obsession, paranoia, and insanity. Whispers of The Yellow Sign spread through every page, blurring the line between dream and reality.
          </p>

          <h2 className="details-sub">Now, in 2024, the nightmare returns.</h2>

          <p>
            As part of the official Penguin Weird Fiction Collection launch, The King in Yellow has been reintroduced in a newly curated edition celebrating the finest classics of weird literature. Released on October 17th, 2024, this edition was carefully curated and revised by editor Edward Kirke, bringing Chambers’ haunting vision to a new generation of readers.
          </p>

          <p>
            Inspired by vintage Penguin paperbacks, fin-de-siècle illustration, and psychedelic horror aesthetics from the 60s and 70s, the new design transforms the book into both a collector’s artifact and a portal into one of horror’s most influential mythologies.
          </p>

          <p>
            This release focuses on the core stories directly connected to The King in Yellow mythos — the tales that introduced Carcosa, The Yellow Sign, and the unseen King himself.
          </p>
        </div>

        {/* Purchase Section */}
        <section className="purchase-section">
          <div className="book-preview">
            <img src={bookCover} alt="The King in Yellow Book Cover" className="book-img" />
          </div>
          <div className="purchase-info">
            <h2 className="purchase-title">The King in Yellow</h2>
            <p className="purchase-meta">Robert W. Chambers | Penguin Weird Fiction</p>
            <p className="purchase-desc">
              Experience the definitive edition of the cosmic horror classic. Newly curated and featuring a stunning collectible design.
            </p>
            <a 
              href="https://www.penguin.co.uk/books/467853/the-king-in-yellow-by-chambers-robert-w/9781405972963" 
              className="purchase-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Purchase Now
            </a>
          </div>
        </section>

        {/* Collection Showcase */}
        <section className="collection-section">
          <div className="collection-header">
            <h3 className="collection-label">Explore the collection</h3>
            <p className="collection-sub">The Penguin Weird Fiction Collection</p>
          </div>
          <img src={collectionImage} alt="Penguin Weird Fiction Collection" className="collection-img" />
          
          <div className="collection-footer">
            <a href="https://www.penguin.co.uk/" target="_blank" rel="noopener noreferrer" className="collection-button">
              Visit penguin.co.uk
            </a>
          </div>
        </section>

        {/* Final Footer Question */}
        <div className="details-footer">
          <p className="footer-line">The curtain rises once more.</p>
          <p className="footer-question">Have you seen the Yellow Sign?</p>
        </div>

        {/* Site Footer */}
        <footer className="site-footer">
          <div className="footer-copyright">
            @2024 All rights reserved
          </div>
          <div className="footer-made-by">
            <span>Made by</span>
            <img src={tomaTeLogo} alt="Toma-te Logo" className="footer-brand-logo" />
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App

