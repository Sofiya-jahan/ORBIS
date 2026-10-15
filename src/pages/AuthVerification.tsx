import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Lock, CheckCircle2, Cpu, KeyRound, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const verificationSteps = [
  { id: 1, text: 'Scanning Biometric Signature...', subtext: 'Capturing capacitive ridges & cryptographic seed', icon: Fingerprint, color: '#10B981' },
  { id: 2, text: 'Executing Quantum Handshake...', subtext: 'Validating lattice-based key exchange protocol', icon: KeyRound, color: '#E5C07B' },
  { id: 3, text: 'Neural Security Matrix Verification...', subtext: 'Analyzing session behavioral integrity', icon: Cpu, color: '#00F2FE' },
  { id: 4, text: 'Access Clearance Authorized', subtext: 'Provisioning institutional workspace sandbox', icon: ShieldCheck, color: '#34D399' },
];

export const AuthVerification = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const navigate = useNavigate();
  const { organization, role, isAuthenticated, isAuthLoaded } = useAuthStore();

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

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#070A0E',
      color: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "var(--font-family, 'Inter', sans-serif)",
    }}>
      
      {/* Background Animated Atmosphere */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.18) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(229, 192, 123, 0.1) 0%, transparent 55%)' }} />
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
          background: 'rgba(10, 18, 23, 0.94)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '24px',
          padding: '3.5rem 3rem',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(16, 185, 129, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
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
              border: `2px dashed ${activeStep.color}`,
              boxShadow: `0 0 25px ${activeStep.color}50`,
            }}
          />

          {/* Inner Glowing Scanner Core */}
          <div style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(7, 10, 14, 0.9) 85%)',
            border: '1px solid rgba(229, 192, 123, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <CurrentIcon size={48} color={activeStep.color} />

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
                  background: '#10B981',
                  boxShadow: '0 0 10px #10B981, 0 0 20px #E5C07B',
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
              color: '#E5C07B',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
              fontFamily: "'Space Mono', monospace"
            }}>
              AUTHENTICATION PROTOCOL // 0{currentStep + 1}
            </div>

            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.5px', color: '#FFFFFF', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
              {activeStep.text}
            </h2>

            <p style={{ color: '#CBD5E1', fontSize: '0.95rem', maxWidth: '380px', margin: '0 auto', fontFamily: "var(--font-family, 'Inter', sans-serif)" }}>
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
                  background: isCompleted ? '#10B981' : 'rgba(255, 255, 255, 0.15)',
                  boxShadow: isCompleted ? '0 0 12px rgba(16, 185, 129, 0.6)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            );
          })}
        </div>

        {/* Bottom Status Feed */}
        <div style={{
          width: '100%',
          background: 'rgba(15, 23, 30, 0.9)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '12px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          fontFamily: "'Space Mono', monospace",
        }}>
          <span style={{ color: '#94A3B8' }}>ENCRYPTION STATUS:</span>
          <span style={{ color: '#E5C07B', fontWeight: 700 }}>256-BIT QUANTUM LATTICE</span>
        </div>

      </motion.div>

    </div>
  );
};

export default AuthVerification;
