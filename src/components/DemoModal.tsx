import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, X, Maximize, Brain } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.log('Autoplay prevented', e));
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth cinematic zoom
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            backgroundColor: '#030811', display: 'flex', flexDirection: 'column'
          }}
        >
          {/* Top Bar */}
          <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem', zIndex: 10,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'linear-gradient(to bottom, rgba(3,8,17,0.9), transparent)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '10px', background: 'rgba(0,198,255,0.1)', borderRadius: '12px', border: '1px solid rgba(0,198,255,0.3)' }}>
                <Brain size={24} color="#00C6FF" />
              </div>
              <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '2px', fontFamily: 'var(--font-heading)' }}>
                IPRAP PRODUCT EXPERIENCE
              </span>
            </div>
            
            <button 
              onClick={onClose} 
              style={{ 
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', 
                color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem', borderRadius: '30px', backdropFilter: 'blur(10px)', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.875rem' }}>Exit Experience</span>
              <X size={20} />
            </button>
          </div>

          {/* Video Container */}
          <div style={{ flex: 1, position: 'relative', background: '#000' }}>
            <video
              ref={videoRef}
              src="https://cdn.pixabay.com/video/2020/05/14/39003-421714138_large.mp4"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              autoPlay playsInline muted={isMuted} loop
            />

            {/* Simulated UI Overlays for "AI Platform" feel */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '150px', border: '1px solid rgba(0,198,255,0.3)', background: 'rgba(0,198,255,0.05)', backdropFilter: 'blur(4px)', borderRadius: '12px' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,198,255,0.3)', color: '#00C6FF', fontSize: '0.8rem', letterSpacing: '1px' }}>GLOBAL SCAN</div>
                <div style={{ padding: '1rem', color: 'white', fontSize: '2rem', fontFamily: 'monospace' }}>ANALYZING...</div>
              </div>
              <div style={{ position: 'absolute', bottom: '25%', right: '10%', width: '250px', height: '200px', border: '1px solid rgba(122,92,255,0.3)', background: 'rgba(122,92,255,0.05)', backdropFilter: 'blur(4px)', borderRadius: '12px' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(122,92,255,0.3)', color: '#7A5CFF', fontSize: '0.8rem', letterSpacing: '1px' }}>PREDICTIVE MODELS</div>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ height: '4px', width: '100%', background: 'rgba(122,92,255,0.2)' }}><div style={{ height: '100%', width: '85%', background: '#7A5CFF' }} /></div>
                  <div style={{ height: '4px', width: '100%', background: 'rgba(122,92,255,0.2)' }}><div style={{ height: '100%', width: '60%', background: '#7A5CFF' }} /></div>
                  <div style={{ height: '4px', width: '100%', background: 'rgba(122,92,255,0.2)' }}><div style={{ height: '100%', width: '95%', background: '#7A5CFF' }} /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem',
            background: 'linear-gradient(to top, rgba(3,8,17,1), transparent)', zIndex: 10
          }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div 
                style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', cursor: 'pointer', overflow: 'hidden', marginBottom: '1.5rem' }}
                onClick={(e) => {
                  if (videoRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    videoRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
                  }
                }}
              >
                <div style={{ height: '100%', width: `${progress}%`, background: '#00C6FF', transition: 'width 0.1s linear', boxShadow: '0 0 10px #00C6FF' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                  </button>
                  <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                  </button>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    {videoRef.current ? 
                      `${Math.floor(videoRef.current.currentTime / 60)}:${Math.floor(videoRef.current.currentTime % 60).toString().padStart(2, '0')} / 0:60` 
                      : '0:00 / 0:60'}
                  </span>
                </div>
                
                <div style={{ color: '#00C6FF', fontSize: '0.875rem', letterSpacing: '2px', fontWeight: 600 }}>
                  SECURE CONNECTION ESTABLISHED
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
