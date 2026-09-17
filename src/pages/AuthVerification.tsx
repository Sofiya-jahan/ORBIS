import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Lock, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const verificationSteps = [
  { text: 'Validating Credentials...', icon: Fingerprint },
  { text: 'Identity Confirmed', icon: ShieldCheck },
  { text: 'Encrypted Session Established', icon: Lock },
  { text: 'Secure Authentication Verified', icon: CheckCircle2 }
];

export const AuthVerification = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { organization, role } = useAuthStore();

  useEffect(() => {
    if (step < verificationSteps.length - 1) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        // After animation completes, route based on state
        if (organization && role) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/organization', { replace: true });
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, navigate, organization, role]);

  const CurrentIcon = verificationSteps[step].icon;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#071423', color: 'white', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,198,255,0.1) 0%, transparent 60%)' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'rgba(7,20,35,0.8)', padding: '4rem', borderRadius: '24px',
          border: '1px solid rgba(0,198,255,0.3)', backdropFilter: 'blur(20px)',
          boxShadow: '0 0 40px rgba(0,198,255,0.1)'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
          >
            <div style={{ position: 'relative' }}>
              <motion.div 
                animate={step === verificationSteps.length - 1 ? {} : { rotate: 360 }} 
                transition={{ duration: 2, repeat: step === verificationSteps.length - 1 ? 0 : Infinity, ease: "linear" }}
                style={{ 
                  width: '100px', height: '100px', borderRadius: '50%', 
                  border: `2px ${step === verificationSteps.length - 1 ? 'solid' : 'dashed'} ${step === verificationSteps.length - 1 ? '#00FFB2' : '#00C6FF'}`, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 20px ${step === verificationSteps.length - 1 ? 'rgba(0,255,178,0.4)' : 'rgba(0,198,255,0.2)'}`
                }}
              >
                <CurrentIcon size={40} color={step === verificationSteps.length - 1 ? '#00FFB2' : '#00C6FF'} />
              </motion.div>
            </div>
            
            <h2 style={{ 
              fontFamily: 'monospace', fontSize: '1.25rem', letterSpacing: '2px', 
              color: step === verificationSteps.length - 1 ? '#00FFB2' : '#00C6FF',
              textTransform: 'uppercase'
            }}>
              {verificationSteps[step].text}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div style={{ width: '300px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '3rem', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: `${((step + 1) / verificationSteps.length) * 100}%` }}
            transition={{ duration: 0.8 }}
            style={{ height: '100%', background: step === verificationSteps.length - 1 ? '#00FFB2' : '#00C6FF', boxShadow: '0 0 10px currentColor' }}
          />
        </div>
      </motion.div>

    </div>
  );
};

export default AuthVerification;
