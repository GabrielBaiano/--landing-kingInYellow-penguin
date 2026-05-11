import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import EtchedCrown from './EtchedCrown'
import penguinLogo from './assets/Penguin_logo.svg'
import bookCover from './assets/book_cover.jpg'
import ancientSorceries from './assets/ancient_sorceries.jpg'
import claimed from './assets/claimed.webp'
import houseOnTheBorderland from './assets/house_on_the_borderland.jpg'
import weirdFictionAnthology from './assets/weird_fiction_anthology.jpg'
import tomaTeLogo from './assets/logo-vertical.svg'
import './index.css'

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = window.scrollY / totalHeight
      setScrollProgress(progress)
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    // Auto-scroll sequence for recording
    const runAutoScroll = async () => {
      const smoothScrollTo = (targetY, duration, easing = t => t) => {
        return new Promise(resolve => {
          const startY = window.scrollY;
          const distance = targetY - startY;
          const startTime = performance.now();

          const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easing(progress);
            window.scrollTo(0, startY + distance * easeProgress);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              resolve();
            }
          };
          requestAnimationFrame(step);
        });
      };

      const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;

      // 1. Show home, wait 2 seconds
      await new Promise(r => setTimeout(r, 2000));

      // 2. Scroll meio rápido to "the king in yellow"
      const editorialSec = document.querySelector('.editorial-section');
      if (editorialSec) {
        // Scroll slightly past the top so it's well framed
        const target = editorialSec.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.1;
        await smoothScrollTo(target, 1500, easeInOutQuad);
        
        // Wait 1 second before the slow scroll
        await new Promise(r => setTimeout(r, 1000));
      }

      // 3. Scroll um pouco devagar e mais suave (through the text)
      const detailsSec = document.querySelector('.editorial-details');
      if (detailsSec) {
        // Scroll to the end of the text section
        const target = detailsSec.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.5;
        await smoothScrollTo(target, 7000, easeInOutSine);
      }

      // 4. Scroll suave mais rápido to products
      const purchaseSec = document.querySelector('.purchase-section');
      if (purchaseSec) {
        const target = purchaseSec.getBoundingClientRect().top + window.scrollY - 50;
        await smoothScrollTo(target, 1800, easeInOutQuad);
        await new Promise(r => setTimeout(r, 800)); // small pause on the product
      }

      // 5. Scroll to the end of the footer
      const targetEnd = document.documentElement.scrollHeight - window.innerHeight;
      await smoothScrollTo(targetEnd, 2500, easeInOutQuad);
    };

    // Wait a bit for the page to render fully, then start
    setTimeout(runAutoScroll, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
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
        <header 
          className="ui-header"
          style={{ 
            opacity: isMobile ? Math.max(0, 1 - scrollProgress * 10) : 1,
            pointerEvents: isMobile && scrollProgress > 0.1 ? 'none' : 'auto'
          }}
        >
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
          <div className="collection-grid">
            <div className="collection-item">
              <img src={ancientSorceries} alt="Ancient Sorceries" className="collection-item-img" />
              <div className="collection-item-info">
                <h4>Ancient Sorceries</h4>
                <p>Algernon Blackwood</p>
              </div>
            </div>
            <div className="collection-item">
              <img src={claimed} alt="Claimed!" className="collection-item-img" />
              <div className="collection-item-info">
                <h4>Claimed!</h4>
                <p>Gertrude Barrows Bennett</p>
              </div>
            </div>
            <div className="collection-item">
              <img src={houseOnTheBorderland} alt="The House on the Borderland" className="collection-item-img" />
              <div className="collection-item-info">
                <h4>The House on the Borderland</h4>
                <p>William Hope Hodgson</p>
              </div>
            </div>
            <div className="collection-item highlight">
              <img src={bookCover} alt="The King in Yellow" className="collection-item-img" />
              <div className="collection-item-info">
                <h4>The King in Yellow</h4>
                <p>Robert W. Chambers</p>
              </div>
            </div>
            <div className="collection-item">
              <img src={weirdFictionAnthology} alt="Weird Fiction: An Anthology" className="collection-item-img" />
              <div className="collection-item-info">
                <h4>Weird Fiction</h4>
                <p>An Anthology</p>
              </div>
            </div>
          </div>
          
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

