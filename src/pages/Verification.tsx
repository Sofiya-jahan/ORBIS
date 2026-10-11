import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';
import { 
  ShieldCheck, Loader2, Lock, ShieldAlert, 
  KeyRound, Sparkles, ChevronLeft, ArrowRight, Shield, Check
} from 'lucide-react';

export const Verification = () => {
  const navigate = useNavigate();
  const { organization, role, verifyPIN, setOrganization, setRole } = useAuthStore();
  
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Default fallback if accessed directly
  const activeOrgId = organization || 'hospital';
  const currentOrg = ORGANIZATIONS[activeOrgId] || ORGANIZATIONS.hospital;
  const currentRole = currentOrg.roles.find(r => r.id === role) || currentOrg.roles[0];

  useEffect(() => {
    if (!organization) {
      setOrganization('hospital');
    }
    if (!role) {
      setRole('cmo');
    }
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [organization, role, setOrganization, setRole]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9a-zA-Z]*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.toUpperCase();
    setPin(newPin);
    setError('');

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit if all 6 digits entered
    if (index === 5 && value && newPin.every(v => v !== '')) {
      handleSubmitKey(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmitKey();
    }
  };

  const handleSubmitKey = async (specifiedKey?: string) => {
    // If key is not provided (or blank/incomplete), default to '123456' as specified!
    const keyToSubmit = (specifiedKey && specifiedKey.trim().length === 6)
      ? specifiedKey.trim()
      : (pin.join('').length === 6 ? pin.join('') : '123456');

    // Visually fill the inputs if they were not filled
    if (pin.every(p => p === '')) {
      setPin(keyToSubmit.split(''));
    }

    setIsLoading(true);
    setError('');

    try {
      const isValid = await verifyPIN(keyToSubmit);
      if (isValid || keyToSubmit === '123456') {
        sessionStorage.setItem('iprap_key_verified', 'true');
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1100);
      } else {
        setError('Invalid Security Key. Defaulting to 123456 will grant institutional access.');
        setIsLoading(false);
      }
    } catch {
      sessionStorage.setItem('iprap_key_verified', 'true');
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1100);
    }
  };

  const handleAutofillDefault = () => {
    const defaultKey = ['1', '2', '3', '4', '5', '6'];
    setPin(defaultKey);
    handleSubmitKey('123456');
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      backgroundColor: '#070A0E',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "var(--font-family, 'Inter', sans-serif)"
    }}>
      
      {/* Background ambient glow matching sovereign emerald and champagne gold funnel */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: error 
          ? 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)' 
          : success 
          ? 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(229, 192, 123, 0.08) 40%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none', transition: 'all 0.5s ease'
      }} />

      <div style={{ 
        width: '100%', 
        maxWidth: '540px', 
        padding: '3rem 2.5rem', 
        position: 'relative', 
        zIndex: 1, 
        background: 'rgba(10, 18, 23, 0.94)',
        backdropFilter: 'blur(30px)',
        borderRadius: '24px',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderTop: `4px solid ${error ? '#EF4444' : success ? '#10B981' : '#E5C07B'}`,
        boxShadow: '0 30px 70px rgba(0, 0, 0, 0.9), 0 0 45px rgba(16, 185, 129, 0.2)'
      }}>
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/role-selection')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: '#E5C07B',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            padding: 0,
            fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)"
          }}
        >
          <ChevronLeft size={16} /> Back to Role Selection
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          
          {/* Animated Shield/Icon */}
          <div style={{ 
            width: '84px', height: '84px', borderRadius: '24px', 
            background: error 
              ? 'rgba(239, 68, 68, 0.15)' 
              : success 
              ? 'rgba(16, 185, 129, 0.25)' 
              : 'rgba(16, 185, 129, 0.15)', 
            color: error ? '#EF4444' : success ? '#10B981' : '#E5C07B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: error 
              ? '0 0 25px rgba(239, 68, 68, 0.35)' 
              : success 
              ? '0 0 35px rgba(16, 185, 129, 0.45)' 
              : '0 0 30px rgba(229, 192, 123, 0.35)',
            border: `1px solid ${error ? '#EF4444' : success ? '#10B981' : 'rgba(229, 192, 123, 0.4)'}`
          }}>
            {error ? <ShieldAlert size={42} /> : success ? <ShieldCheck size={42} /> : <KeyRound size={42} />}
          </div>
          
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '800',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#E5C07B',
            marginBottom: '0.4rem',
            fontFamily: "'Space Mono', 'JetBrains Mono', monospace"
          }}>
            PHASE 3: INSTITUTIONAL SECURITY KEY
          </div>

          <h2 style={{ fontSize: '2.1rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center', color: '#FFFFFF', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
            {success ? 'Security Verification Complete' : 'Enter Institution Key'}
          </h2>
          <p style={{ color: '#CBD5E1', textAlign: 'center', fontSize: '0.96rem', lineHeight: 1.5, fontFamily: "var(--font-family, 'Inter', sans-serif)" }}>
            {success ? 'Cryptographic session verified. Launching sovereign workspace...' : 'Enter your 6-character organizational security key. If not provided, default key 123456 is applied.'}
          </p>
        </div>

        {!success && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>
            
            {/* Identity Badge */}
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', 
              padding: '0.85rem 1.25rem', borderRadius: '14px', 
              backgroundColor: 'rgba(15, 23, 30, 0.85)', border: '1px solid rgba(16, 185, 129, 0.25)',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#E5C07B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Lock size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: "'Space Mono', monospace" }}>
                  Selected Institution & Role
                </span>
                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#FFFFFF', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
                  {currentOrg.name} &bull; <span style={{ color: '#E5C07B' }}>{currentRole.title}</span>
                </span>
              </div>
            </div>

            {/* Default Key Helper Notice */}
            <div style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#10B981" />
                <span style={{ fontSize: '0.8rem', color: '#CBD5E1', fontFamily: "var(--font-family, 'Inter', sans-serif)" }}>
                  Institutional Key: <strong style={{ color: '#10B981', fontFamily: "'JetBrains Mono', monospace" }}>123456</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutofillDefault}
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34D399',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
                  transition: 'all 0.2s ease'
                }}
              >
                Auto-Fill 123456
              </button>
            </div>

            {/* 6-Digit PIN Inputs */}
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center' }}>
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    placeholder="•"
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    disabled={isLoading}
                    style={{
                      width: '52px', height: '62px',
                      fontSize: '1.75rem', textAlign: 'center', fontWeight: '800', fontFamily: "'Space Mono', 'JetBrains Mono', monospace",
                      borderRadius: '14px', border: '1px solid',
                      borderColor: error ? '#EF4444' : digit ? '#10B981' : 'rgba(16, 185, 129, 0.3)',
                      backgroundColor: 'rgba(15, 23, 30, 0.9)', color: '#FFFFFF',
                      boxShadow: digit && !error ? '0 0 15px rgba(16, 185, 129, 0.35)' : 'none',
                      transition: 'all 0.2s', outline: 'none'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#10B981';
                      e.target.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = error ? '#EF4444' : digit ? '#10B981' : 'rgba(16, 185, 129, 0.3)';
                      e.target.style.boxShadow = digit && !error ? '0 0 15px rgba(16, 185, 129, 0.35)' : 'none';
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Primary Action Button (Submits key or automatically defaults to 123456) */}
            <button
              type="button"
              onClick={() => handleSubmitKey()}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1.05rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
                fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(16, 185, 129, 0.6)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Institutional Clearance...</span>
                </>
              ) : (
                <>
                  <span>Authorize Institutional Access</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {error && (
              <div style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: '600', animation: 'fadeIn 0.3s', textAlign: 'center' }}>
                {error}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Verification;
