import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

interface IntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<IntroProps> = ({ onComplete }) => {
  const [scene, setScene] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const sequence = [
      { delay: 1500, next: 1 }, // Scene 0 to 1 (Heartbeat to Network)
      { delay: 2500, next: 2 }, // Scene 1 to 2 (Network to Earth)
      { delay: 2500, next: 3 }, // Scene 2 to 3 (Threat Detected)
      { delay: 2000, next: 4 }, // Scene 3 to 4 (Threat Resolved, Zoom)
      { delay: 1500, next: 5 }, // Scene 4 to 5 (Logo & Text)
    ];

    if (scene < sequence.length) {
      const timer = setTimeout(() => {
        setScene(sequence[scene].next);
      }, sequence[scene].delay);
      return () => clearTimeout(timer);
    }
  }, [scene]);

  const handleEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        animate={isTransitioning ? { scale: 5, opacity: 0, filter: 'blur(20px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          backgroundColor: '#030811', display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', transformOrigin: 'center center'
        }}
      >
        {/* WebGL Background Particles */}
        <div style={{ position: 'absolute', inset: 0, opacity: scene >= 1 ? 1 : 0, transition: 'opacity 2s ease' }}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={scene >= 4 ? 10 : 2} />
          </Canvas>
        </div>

        {/* Ambient Dark Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #030811 100%)' }} />

        {/* Cinematic Visual Elements */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Scene 0: Heartbeat Pulse */}
          <AnimatePresence>
            {scene === 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                exit={{ scale: 10, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00C6FF', boxShadow: '0 0 20px 10px rgba(0,198,255,0.5)' }}
              />
            )}
          </AnimatePresence>

          {/* Scene 1 & 2 & 3: Network & Threat */}
          <AnimatePresence>
            {scene >= 1 && scene <= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: scene === 3 ? 1.2 : 1, 
                  rotate: scene === 3 ? 10 : 0,
                  filter: scene === 3 ? 'hue-rotate(-120deg)' : 'hue-rotate(0deg)' // Turns red
                }}
                exit={{ scale: 20, opacity: 0, filter: 'blur(20px)' }}
                transition={{ duration: 2, ease: "easeInOut" }}
                style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', border: '1px solid rgba(0,198,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(0,198,255,0.1) 0%, transparent 70%)' }}
              >
                {/* Fake connecting lines */}
                <div style={{ position: 'absolute', inset: 100, border: '1px dashed rgba(0,198,255,0.3)', borderRadius: '50%', animation: 'spin 20s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 150, border: '1px dashed rgba(0,198,255,0.4)', borderRadius: '50%', animation: 'spin 15s linear infinite reverse' }} />
                
                {scene === 3 && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}
                    style={{ position: 'absolute', color: '#ff4d4d', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '4px', fontFamily: 'monospace' }}
                  >
                    THREAT DETECTED
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scene 5: Typography & Enter */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AnimatePresence>
            {scene >= 5 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  style={{ textAlign: 'center', marginBottom: '2rem' }}
                >
                  <h2 style={{ 
                    fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: '400', 
                    color: 'rgba(255,255,255,0.7)', letterSpacing: '8px', marginBottom: '1rem', textTransform: 'uppercase'
                  }}>
                    The future isn't predicted
                  </h2>
                  <h1 style={{ 
                    fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: '800', 
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #00C6FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    letterSpacing: '4px', textTransform: 'uppercase'
                  }}>
                    It's Engineered
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 2 }}
                  style={{ display: 'flex', gap: '2rem', marginBottom: '4rem' }}
                >
                  {['Predict.', 'Prevent.', 'Protect.'].map((word, i) => (
                    <span key={i} style={{ 
                      color: 'var(--primary)', fontSize: '1.25rem', letterSpacing: '4px', textTransform: 'uppercase',
                      fontWeight: '700', textShadow: '0 0 10px rgba(0,198,255,0.5)'
                    }}>
                      {word}
                    </span>
                  ))}
                </motion.div>

                {!isTransitioning && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 198, 255, 0.6)', backgroundColor: 'rgba(0,198,255,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEnter}
                    style={{
                      padding: '1.25rem 4rem', fontSize: '1.1rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase',
                      borderRadius: '12px', background: 'transparent', color: 'white',
                      border: '1px solid rgba(0,198,255,0.5)', cursor: 'pointer',
                      backdropFilter: 'blur(10px)', transition: 'all 0.3s'
                    }}
                  >
                    Enter Platform
                  </motion.button>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};
