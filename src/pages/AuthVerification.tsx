import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Lock, CheckCircle2, Cpu, KeyRound, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const verificationSteps = [
  { id: 1, text: 'Scanning Biometric Signature...', subtext: 'Capturing capacitive ridges & cryptographic seed', icon: Fingerprint, color: '#00E5FF' },
  { id: 2, text: 'Executing Quantum Handshake...', subtext: 'Validating lattice-based key exchange protocol', icon: KeyRound, color: '#7B61FF' },
  { id: 3, text: 'Neural Security Matrix Verification...', subtext: 'Analyzing session behavioral integrity', icon: Cpu, color: '#4F8CFF' },
  { id: 4, text: 'Access Clearance Authorized', subtext: 'Provisioning institutional workspace sandbox', icon: ShieldCheck, color: '#00FFB2' },
];

export const AuthVerification = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const navigate = useNavigate();
  const { organization, role } = useAuthStore();

  useEffect(() => {
    if (currentStep < verificationSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 950);
      return () => clearTimeout(timer);
    } else {
      setIsUnlocked(true);
      const timer = setTimeout(() => {
        // Proceed strictly to organization selection (or dashboard if already selected)
        if (organization && role) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/organization', { replace: true });
        }
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [currentStep, navigate, organization, role]);

  const activeStep = verificationSteps[currentStep];
  const CurrentIcon = activeStep.icon;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#050D16',
      color: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-family, system-ui, sans-serif)',
    }}>
      
      {/* Background Animated Atmosphere */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(0,229,255,0.08) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(123,97,255,0.05) 0%, transparent 50%)' }} />
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
          background: 'rgba(8, 21, 34, 0.9)',
          border: `1px solid ${activeStep.color}40`,
          borderRadius: '24px',
          padding: '3.5rem 3rem',
          backdropFilter: 'blur(25px)',
          boxShadow: `0 30px 80px rgba(0,0,0,0.8), 0 0 40px ${activeStep.color}25`,
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
              boxShadow: `0 0 25px ${activeStep.color}40`,
            }}
          />

          {/* Inner Glowing Scanner Core */}
          <div style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${activeStep.color}25 0%, rgba(8,21,34,0.8) 80%)`,
            border: `1px solid ${activeStep.color}60`,
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
                  background: '#00E5FF',
                  boxShadow: '0 0 10px #00E5FF, 0 0 20px #00E5FF',
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
              color: activeStep.color,
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
            }}>
              AUTHENTICATION PROTOCOL // 0{currentStep + 1}
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
              {activeStep.text}
            </h2>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
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
                  background: isCompleted ? activeStep.color : 'rgba(255,255,255,0.15)',
                  boxShadow: isCompleted ? `0 0 10px ${activeStep.color}` : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            );
          })}
        </div>

        {/* Bottom Status Feed */}
        <div style={{
          width: '100%',
          background: 'rgba(5, 13, 22, 0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>ENCRYPTION STATUS:</span>
          <span style={{ color: '#00FFB2', fontWeight: 700 }}>256-BIT QUANTUM LATTICE</span>
        </div>

      </motion.div>

    </div>
  );
};

export default AuthVerification;
