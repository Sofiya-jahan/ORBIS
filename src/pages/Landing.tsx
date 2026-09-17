import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AIIntelligenceCore } from '../components/AIIntelligenceCore';
import { DemoModal } from '../components/DemoModal';
import { Play } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const AnimatedCounter = ({ value, label, suffix = '' }: any) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value.replace(/,/g, ''));
    if (start === end) return;
    let totalMilSecDur = 2000;
    let incrementTime = (totalMilSecDur / end) * 2;

    const timer = setInterval(() => {
      start += end / 50; // 50 steps
      if (start > end) start = end;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, totalMilSecDur / 50);

    return () => clearInterval(timer);
  }, [value]);

  const displayValue = count % 1 === 0 ? count.toString() : count.toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div style={{ 
        fontSize: '3.5rem', fontWeight: '800', fontFamily: 'monospace', 
        background: 'linear-gradient(to bottom, #ffffff, #00C6FF)', 
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        textShadow: '0 0 20px rgba(0, 198, 255, 0.4)'
      }}>
        {displayValue}{suffix}
      </div>
      <div style={{ color: 'var(--primary)', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px' }}>
        {label}
      </div>
    </div>
  );
};

const Landing = () => {
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, organization, role } = useAuthStore();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (organization && role) {
        navigate('/dashboard');
      } else {
        navigate('/organization');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#071423', color: 'white', overflowX: 'hidden', 
      fontFamily: 'var(--font-family)', position: 'relative', minHeight: '100vh' 
    }}>
      
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />

      {/* Layered Animated Background System */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 50%, rgba(0,198,255,0.08) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 80%, rgba(122,92,255,0.05) 0%, transparent 50%)' }} />
        <div className="digital-fog" />
      </div>

      {/* Hero Section */}
      <section style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1, alignItems: 'center' }}>
        
        {/* LEFT: Typography & Actions */}
        <div style={{ flex: '0 0 50%', padding: '0 6rem', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.5, ease: "easeOut" }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '0.5rem 1rem', border: '1px solid rgba(0,198,255,0.3)', borderRadius: '20px', background: 'rgba(0,198,255,0.05)', backdropFilter: 'blur(10px)' }}>
                <span style={{ color: '#00C6FF', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '1px' }}>SYSTEM ONLINE v4.0</span>
              </div>
            </div>
            
            <h1 style={{ 
              fontSize: '5.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', lineHeight: '1.05', marginBottom: '1.5rem',
              letterSpacing: '-1px'
            }}>
              The Future of <br />
              <span style={{ 
                background: 'linear-gradient(135deg, #00C6FF 0%, #7A5CFF 100%)', 
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(0,198,255,0.3)'
              }}>
                Enterprise
              </span><br />
              Risk Intelligence
            </h1>
            
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', maxWidth: '550px', lineHeight: '1.6', marginBottom: '3rem', fontWeight: 300 }}>
              Anticipate anomalies before they become threats. IPRAP computes the future of global physical and digital assets using cognitive AI.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,198,255,0.4)' }} whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                style={{ 
                  padding: '1.25rem 3rem', fontSize: '1.1rem', fontWeight: '700', borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #00C6FF 0%, #0077ff 100%)', color: 'white', border: 'none', cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(0,198,255,0.2)'
                }}
              >
                Get Started
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowDemo(true)}
                style={{ 
                  padding: '1.25rem 2.5rem', fontSize: '1.1rem', fontWeight: '600', borderRadius: '12px', 
                  background: 'rgba(7,20,35,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={12} fill="white" />
                </div>
                Watch Product Experience
              </motion.button>
            </div>

            {/* Hero Metrics */}
            <div style={{ display: 'flex', gap: '4rem', marginTop: '5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '3rem' }}>
              <AnimatedCounter value="98.97" suffix="%" label="Prediction Accuracy" />
              <AnimatedCounter value="1.8" suffix="B" label="Records Processed" />
              <AnimatedCounter value="420" suffix="+" label="Organizations Protected" />
            </div>

          </motion.div>
        </div>

        {/* RIGHT: AI Intelligence Core */}
        <div style={{ flex: '0 0 50%', height: '100vh', position: 'relative' }}>
          <AIIntelligenceCore />
        </div>
      </section>

      <style>{`
        .digital-fog {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0,198,255,0.03) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(0,198,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(circle at center, black 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 0%, transparent 80%);
          animation: drift 20s linear infinite;
        }
        @keyframes drift {
          from { background-position: 0 0; }
          to { background-position: 60px 60px; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
