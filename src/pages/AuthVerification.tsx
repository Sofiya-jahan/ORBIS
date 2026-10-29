import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Lock, CheckCircle2, Cpu, KeyRound, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ThemeToggle } from '../components/ThemeToggle';

const verificationSteps = [
  { id: 1, text: 'Scanning Biometric Signature...', subtext: 'Capturing capacitive ridges & cryptographic seed', icon: Fingerprint, color: '#6AE7F7', lightColor: '#0284C7' },
  { id: 2, text: 'Executing Quantum Handshake...', subtext: 'Validating lattice-based key exchange protocol', icon: KeyRound, color: '#2E9BF8', lightColor: '#2563EB' },
  { id: 3, text: 'Neural Security Matrix Verification...', subtext: 'Analyzing session behavioral integrity', icon: Cpu, color: '#8671F9', lightColor: '#7C3AED' },
  { id: 4, text: 'Access Clearance Authorized', subtext: 'Provisioning institutional workspace sandbox', icon: ShieldCheck, color: '#D9FBFF', lightColor: '#0D9488' },
];

export const AuthVerification = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const navigate = useNavigate();
  const { organization, role, isAuthenticated, isAuthLoaded, theme } = useAuthStore();
  const isLight = theme === 'light';

  useEffect(() => {
    if (isAuthLoaded && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthLoaded, isAuthenticated, navigate]);

  useEffect(() => {
    if (currentStep < verificationSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 950);
      return () => clearTimeout(timer);
    } else {
      setIsUnlocked(true);
      const timer = setTimeout(() => {
        // Proceed strictly to institutional security key verification
        navigate('/security-key', { replace: true });
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [currentStep, navigate]);

  const activeStep = verificationSteps[currentStep];
  const CurrentIcon = activeStep.icon;
  const activeColor = isLight ? activeStep.lightColor : activeStep.color;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: isLight ? '#F7F9FC' : '#07112E',
      color: isLight ? '#172033' : '#F6FDFF',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "var(--font-family, 'Inter', sans-serif)",
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }}>
      
      {/* Top Bar Theme Switcher */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', zIndex: 30 }}>
        <ThemeToggle variant="compact" />
      </div>

      {/* Background Animated Atmosphere */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 65%)'
            : 'radial-gradient(circle at 50% 50%, rgba(21, 84, 232, 0.22) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? 'radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.07) 0%, transparent 55%)'
            : 'radial-gradient(circle at 70% 30%, rgba(106, 231, 247, 0.12) 0%, transparent 55%)',
        }} />
      </div>

      {/* Main Terminal Vault Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={isUnlocked ? { scale: 1.05, opacity: 0, filter: 'blur(15px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '560px',
          background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(7, 17, 46, 0.92)',
          border: isLight ? '1px solid #DCE5F2' : '1px solid rgba(46, 155, 248, 0.25)',
          borderRadius: '24px',
          padding: '3.5rem 3rem',
          backdropFilter: 'blur(32px)',
          boxShadow: isLight
            ? '0 20px 50px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.04)'
            : '0 30px 80px rgba(7, 17, 46, 0.9), 0 0 50px rgba(21, 84, 232, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Animated Scanner Ring */}
        <div style={{ position: 'relative', width: '130px', height: '130px', marginBottom: '2.5rem' }}>
          
          {/* Rotating Dashed Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `2px dashed ${activeColor}`,
              boxShadow: isLight ? `0 0 16px ${activeColor}30` : `0 0 25px ${activeColor}50`,
            }}
          />

          {/* Inner Glowing Scanner Core */}
          <div style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '50%',
            background: isLight
              ? 'radial-gradient(circle, rgba(238, 243, 249, 0.95) 0%, rgba(247, 249, 252, 0.98) 85%)'
              : 'radial-gradient(circle, rgba(21, 84, 232, 0.3) 0%, rgba(7, 17, 46, 0.95) 85%)',
            border: isLight ? '1px solid #DCE5F2' : '1px solid rgba(106, 231, 247, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <CurrentIcon size={48} color={activeColor} />

            {/* Laser Scan Line */}
            {currentStep < 3 && (
              <motion.div
                animate={{ y: [-45, 45, -45] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: activeColor,
                  boxShadow: isLight
                    ? `0 0 8px ${activeColor}`
                    : `0 0 10px ${activeColor}, 0 0 20px #2E9BF8`,
                }}
              />
            )}
          </div>
        </div>

        {/* Dynamic Verification Step Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            style={{ marginBottom: '2.5rem' }}
          >
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '2.5px',
              color: isLight ? '#2563EB' : '#6AE7F7',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              AUTHENTICATION PROTOCOL // 0{currentStep + 1}
            </div>

            <h2 style={{
              fontSize: '1.9rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
              letterSpacing: '-0.5px',
              color: isLight ? '#172033' : '#F6FDFF',
              fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)"
            }}>
              {activeStep.text}
            </h2>

            <p style={{
              color: isLight ? '#52637A' : 'rgba(246, 253, 255, 0.75)',
              fontSize: '0.95rem',
              maxWidth: '380px',
              margin: '0 auto',
              fontFamily: "var(--font-family, 'Inter', sans-serif)"
            }}>
              {activeStep.subtext}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Step Progress Dots */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2.5rem' }}>
          {verificationSteps.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            return (
              <div
                key={step.id}
                style={{
                  width: idx === currentStep ? '32px' : '10px',
                  height: '6px',
                  borderRadius: '3px',
                  background: isCompleted
                    ? (isLight ? '#2563EB' : '#2E9BF8')
                    : (isLight ? '#E2E8F0' : 'rgba(246, 253, 255, 0.15)'),
                  boxShadow: isCompleted
                    ? (isLight ? '0 2px 6px rgba(37, 99, 235, 0.3)' : '0 0 12px rgba(46, 155, 248, 0.7)')
                    : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            );
          })}
        </div>

        {/* Bottom Status Feed */}
        <div style={{
          width: '100%',
          background: isLight ? '#F1F5F9' : 'rgba(13, 35, 77, 0.75)',
          border: isLight ? '1px solid #DCE5F2' : '1px solid rgba(46, 155, 248, 0.25)',
          borderRadius: '12px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <span style={{ color: isLight ? '#7F8DA5' : 'rgba(246, 253, 255, 0.65)' }}>ENCRYPTION STATUS:</span>
          <span style={{ color: isLight ? '#2563EB' : '#6AE7F7', fontWeight: 700 }}>256-BIT QUANTUM LATTICE</span>
        </div>

      </motion.div>

    </div>
  );
};

export default AuthVerification;
