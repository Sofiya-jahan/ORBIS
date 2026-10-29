import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';
import { 
  ShieldCheck, Loader2, Lock, ShieldAlert, 
  KeyRound, Sparkles, ChevronLeft, ArrowRight, Shield, Check, Clock
} from 'lucide-react';
import { 
  createSecuritySession, 
  checkRateLimit, 
  recordFailedAttempt, 
  resetRateLimit, 
  logSecurityEvent 
} from '../services/securityService';
import { ThemeToggle } from '../components/ThemeToggle';

export const Verification = () => {
  const navigate = useNavigate();
  const { organization, role, user, verifyPIN, setOrganization, setRole, theme } = useAuthStore();
  const isLight = theme === 'light';
  
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lockoutSec, setLockoutSec] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check rate limit on mount
  useEffect(() => {
    const status = checkRateLimit('auth_key_attempt', 5, 60000);
    setRemainingAttempts(status.remainingAttempts);
    if (status.isLocked) {
      setLockoutSec(status.retryAfterSec);
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutSec <= 0) return;
    const interval = setInterval(() => {
      setLockoutSec(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setRemainingAttempts(5);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSec]);

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
    // Check if locked out
    const rateStatus = checkRateLimit('auth_key_attempt', 5, 60000);
    if (rateStatus.isLocked) {
      setLockoutSec(rateStatus.retryAfterSec);
      setError(`Rate Limit Exceeded: Lockout active for ${rateStatus.retryAfterSec}s to prevent brute-force attacks.`);
      return;
    }

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

    let isValid = false;
    try {
      isValid = await verifyPIN(keyToSubmit);
    } catch {
      isValid = false;
    }

    if (isValid || keyToSubmit === '123456') {
      resetRateLimit('auth_key_attempt');
      setRemainingAttempts(5);
      createSecuritySession(activeOrgId, role || 'cmo', user?.email || 'operator@orbis.ai');
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1100);
    } else {
      const failStatus = recordFailedAttempt('auth_key_attempt', 5, 45000, 60000);
      setRemainingAttempts(failStatus.remainingAttempts);
      if (failStatus.isLocked) {
        setLockoutSec(failStatus.retryAfterSec);
        setError(`Security Lockout Active: Too many failed key attempts. Unlocking in ${failStatus.retryAfterSec}s.`);
      } else {
        setError(`Invalid Security Key. ${failStatus.remainingAttempts} attempt(s) remaining before temporary lockout. Tip: 123456 grants institutional access.`);
      }
      setIsLoading(false);
    }
  };

  const handleAutofillDefault = () => {
    if (lockoutSec > 0) return;
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
      backgroundColor: isLight ? '#F7F9FC' : '#07112E',
      color: isLight ? '#172033' : '#F6FDFF',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "var(--font-family, 'Inter', sans-serif)",
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      
      {/* Top-Right Theme Switcher */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', zIndex: 30 }}>
        <ThemeToggle variant="compact" />
      </div>

      {/* Realistic Architectural Vault Corridor Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${isLight ? '/corridor-portal-light.png' : '/corridor-portal.png'})`,
        backgroundSize: 'cover',
        backgroundPosition: isLight ? 'center 50%' : 'center 40%',
        backgroundRepeat: 'no-repeat',
        filter: isLight ? 'contrast(1.02) brightness(1.02) saturate(1.05)' : 'contrast(1.1) brightness(0.72) saturate(1.15)',
        opacity: isLight ? 0.65 : 0.55,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Organization Dynamic Color Harmony Blend */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isLight
          ? `radial-gradient(circle at 50% 50%, ${currentOrg.themeColor}18 0%, ${currentOrg.accentColor}10 50%, rgba(247, 249, 252, 0.88) 90%)`
          : `radial-gradient(circle at 50% 50%, ${currentOrg.themeColor}33 0%, ${currentOrg.accentColor}1A 50%, rgba(7, 17, 46, 0.95) 90%)`,
        mixBlendMode: isLight ? 'multiply' : 'color-dodge',
        opacity: isLight ? 0.60 : 0.65,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Synchronized Doorway Perimeter Light Column */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '58.4%',
        width: '6px',
        height: '60%',
        background: success 
          ? 'linear-gradient(180deg, #6AE7F7 0%, #2E9BF8 50%, #6AE7F7 100%)' 
          : error 
          ? 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)' 
          : `linear-gradient(180deg, ${currentOrg.accentColor} 0%, #F59E0B 50%, ${currentOrg.themeColor} 100%)`,
        boxShadow: success
          ? '0 0 35px 8px rgba(106, 231, 247, 0.7)'
          : error
          ? '0 0 35px 8px rgba(239, 68, 68, 0.7)'
          : `0 0 25px 6px ${currentOrg.accentColor}66`,
        opacity: isLight ? 0.45 : 0.75,
        borderRadius: '4px',
        zIndex: 0,
        pointerEvents: 'none',
        transition: 'all 0.5s ease'
      }} />

      {/* Background Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isLight
          ? 'radial-gradient(circle at 50% 50%, rgba(247, 249, 252, 0.6) 0%, rgba(238, 243, 249, 0.85) 70%, #F7F9FC 100%)'
          : 'radial-gradient(circle at 50% 50%, rgba(7, 17, 46, 0.65) 0%, rgba(7, 17, 46, 0.92) 70%, #07112E 100%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Background ambient glow matching sovereign sapphire and cyan funnel */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: error 
          ? 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)' 
          : success 
          ? (isLight ? 'radial-gradient(circle, rgba(21, 84, 232, 0.12) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(106, 231, 247, 0.25) 0%, transparent 70%)')
          : (isLight ? 'radial-gradient(circle, rgba(21, 84, 232, 0.08) 0%, rgba(46, 155, 248, 0.04) 40%, transparent 70%)' : 'radial-gradient(circle, rgba(21, 84, 232, 0.22) 0%, rgba(106, 231, 247, 0.1) 40%, transparent 70%)'),
        zIndex: 0, pointerEvents: 'none', transition: 'all 0.5s ease'
      }} />

      <div style={{ 
        width: '100%', 
        maxWidth: '540px', 
        padding: '3rem 2.5rem', 
        position: 'relative', 
        zIndex: 1, 
        background: isLight ? '#FFFFFF' : 'rgba(7, 17, 46, 0.92)',
        backdropFilter: 'blur(32px)',
        borderRadius: '24px',
        border: isLight ? '1px solid #DCE5F2' : '1px solid rgba(46, 155, 248, 0.25)',
        borderTop: `4px solid ${error ? '#EF4444' : success ? (isLight ? '#1554E8' : '#6AE7F7') : '#2E9BF8'}`,
        boxShadow: isLight ? '0 25px 60px rgba(17, 32, 51, 0.08), 0 0 30px rgba(21, 84, 232, 0.04)' : '0 30px 70px rgba(7, 17, 46, 0.95), 0 0 45px rgba(21, 84, 232, 0.2)'
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
            color: isLight ? '#1554E8' : '#6AE7F7',
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
              ? 'rgba(239, 68, 68, 0.12)' 
              : success 
              ? (isLight ? 'rgba(21, 84, 232, 0.1)' : 'rgba(106, 231, 247, 0.2)') 
              : (isLight ? 'rgba(21, 84, 232, 0.08)' : 'rgba(21, 84, 232, 0.2)'), 
            color: error ? '#EF4444' : success ? (isLight ? '#1554E8' : '#6AE7F7') : (isLight ? '#1554E8' : '#2E9BF8'),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: error 
              ? '0 0 25px rgba(239, 68, 68, 0.35)' 
              : success 
              ? (isLight ? '0 4px 20px rgba(21, 84, 232, 0.25)' : '0 0 35px rgba(106, 231, 247, 0.45)') 
              : (isLight ? '0 4px 18px rgba(21, 84, 232, 0.15)' : '0 0 30px rgba(46, 155, 248, 0.35)'),
            border: `1px solid ${error ? '#EF4444' : success ? (isLight ? '#1554E8' : '#6AE7F7') : (isLight ? 'rgba(21, 84, 232, 0.3)' : 'rgba(46, 155, 248, 0.4)')}`
          }}>
            {error ? <ShieldAlert size={42} /> : success ? <ShieldCheck size={42} /> : <KeyRound size={42} />}
          </div>
          
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '800',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: isLight ? '#1554E8' : '#6AE7F7',
            marginBottom: '0.4rem',
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            PHASE 3: INSTITUTIONAL SECURITY KEY
          </div>

          <h2 style={{ fontSize: '2.1rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center', color: isLight ? '#172033' : '#F6FDFF', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
            {success ? 'Security Verification Complete' : 'Enter Institution Key'}
          </h2>
          <p style={{ color: isLight ? '#52637A' : 'rgba(246, 253, 255, 0.75)', textAlign: 'center', fontSize: '0.96rem', lineHeight: 1.5, fontFamily: "var(--font-family, 'Inter', sans-serif)" }}>
            {success ? 'Cryptographic session verified. Launching sovereign workspace...' : 'Enter your 6-character organizational security key. If not provided, default key 123456 is applied.'}
          </p>
        </div>

        {!success && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>
            
            {/* Identity Badge */}
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', 
              padding: '0.85rem 1.25rem', borderRadius: '14px', 
              backgroundColor: isLight ? '#EEF3F9' : 'rgba(13, 35, 77, 0.65)', 
              border: isLight ? '1px solid #DCE5F2' : '1px solid rgba(46, 155, 248, 0.25)',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: isLight ? 'rgba(21, 84, 232, 0.1)' : 'rgba(21, 84, 232, 0.25)',
                color: isLight ? '#1554E8' : '#6AE7F7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Lock size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.72rem', color: isLight ? '#7F8DA5' : 'rgba(246, 253, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: "'JetBrains Mono', monospace" }}>
                  Selected Institution & Role
                </span>
                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: isLight ? '#172033' : '#F6FDFF', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
                  {currentOrg.name} &bull; <span style={{ color: isLight ? '#1554E8' : '#6AE7F7' }}>{currentRole.title}</span>
                </span>
              </div>
            </div>

            {/* Default Key Helper Notice */}
            <div style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: isLight ? '#F0F5FF' : 'rgba(21, 84, 232, 0.15)',
              border: isLight ? '1px solid rgba(21, 84, 232, 0.25)' : '1px solid rgba(46, 155, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color={isLight ? '#1554E8' : '#6AE7F7'} />
                <span style={{ fontSize: '0.8rem', color: isLight ? '#1554E8' : 'rgba(246, 253, 255, 0.8)', fontFamily: "var(--font-family, 'Inter', sans-serif)" }}>
                  Institutional Key: <strong style={{ color: isLight ? '#1554E8' : '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>123456</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutofillDefault}
                style={{
                  background: isLight ? '#FFFFFF' : 'rgba(21, 84, 232, 0.3)',
                  border: isLight ? '1px solid rgba(21, 84, 232, 0.35)' : '1px solid rgba(106, 231, 247, 0.4)',
                  color: isLight ? '#1554E8' : '#6AE7F7',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
                  boxShadow: isLight ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Auto-Fill 123456
              </button>
            </div>

            {/* Active Security Lockout Banner */}
            {lockoutSec > 0 && (
              <div style={{
                width: '100%',
                padding: '0.9rem 1.1rem',
                borderRadius: '12px',
                background: isLight ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.12)',
                border: isLight ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(239, 68, 68, 0.4)',
                color: isLight ? '#B91C1C' : '#F87171',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                boxSizing: 'border-box'
              }}>
                <Clock size={22} className="animate-spin" />
                <div style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 800 }}>Adaptive Security Lockout Active</div>
                  <div>Automated brute-force defense engaged. Key entry unlocked in <strong>{lockoutSec}s</strong>.</div>
                </div>
              </div>
            )}

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
                    disabled={isLoading || lockoutSec > 0}
                    style={{
                      width: '52px', height: '62px',
                      fontSize: '1.75rem', textAlign: 'center', fontWeight: '800', fontFamily: "'JetBrains Mono', monospace",
                      borderRadius: '14px', border: '1px solid',
                      borderColor: lockoutSec > 0 
                        ? 'rgba(239, 68, 68, 0.4)' 
                        : error 
                        ? '#EF4444' 
                        : digit 
                        ? (isLight ? '#1554E8' : '#2E9BF8') 
                        : (isLight ? '#DCE5F2' : 'rgba(46, 155, 248, 0.3)'),
                      backgroundColor: lockoutSec > 0 
                        ? (isLight ? '#F1F5F9' : 'rgba(20, 10, 10, 0.7)') 
                        : (isLight ? '#FFFFFF' : 'rgba(13, 35, 77, 0.75)'), 
                      color: lockoutSec > 0 ? '#9CA3AF' : (isLight ? '#172033' : '#F6FDFF'),
                      boxShadow: isLight 
                        ? (digit && !error ? '0 2px 8px rgba(21, 84, 232, 0.15)' : 'none') 
                        : (digit && !error && lockoutSec === 0 ? '0 0 15px rgba(46, 155, 248, 0.35)' : 'none'),
                      transition: 'all 0.2s', outline: 'none',
                      cursor: lockoutSec > 0 ? 'not-allowed' : 'text'
                    }}
                    onFocus={e => {
                      if (lockoutSec === 0) {
                        e.target.style.borderColor = isLight ? '#1554E8' : '#2E9BF8';
                        e.target.style.boxShadow = isLight ? '0 4px 12px rgba(21, 84, 232, 0.2)' : '0 0 15px rgba(46, 155, 248, 0.45)';
                      }
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = error ? '#EF4444' : digit ? (isLight ? '#1554E8' : '#2E9BF8') : (isLight ? '#DCE5F2' : 'rgba(46, 155, 248, 0.3)');
                      e.target.style.boxShadow = digit && !error ? (isLight ? '0 2px 8px rgba(21, 84, 232, 0.15)' : '0 0 15px rgba(46, 155, 248, 0.35)') : 'none';
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Defense Status Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.72rem', color: isLight ? '#7F8DA5' : 'rgba(246, 253, 255, 0.65)', fontFamily: "'JetBrains Mono', monospace" }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={12} color={isLight ? '#1554E8' : '#6AE7F7'} /> Lattice HMAC-256
              </span>
              <span>
                Attempts: <strong style={{ color: remainingAttempts <= 2 ? '#EF4444' : (isLight ? '#1554E8' : '#6AE7F7') }}>{remainingAttempts}/5</strong>
              </span>
            </div>

            {/* Primary Action Button (Submits key or automatically defaults to 123456) */}
            <button
              type="button"
              onClick={() => handleSubmitKey()}
              disabled={isLoading || lockoutSec > 0}
              style={{
                width: '100%',
                padding: '1.05rem',
                borderRadius: '12px',
                background: lockoutSec > 0 ? 'rgba(55, 65, 81, 0.6)' : 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)',
                border: 'none',
                color: '#F6FDFF',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: (isLoading || lockoutSec > 0) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: lockoutSec > 0 ? 'none' : '0 10px 25px rgba(21, 84, 232, 0.4)',
                fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (!isLoading && lockoutSec === 0) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(46, 155, 248, 0.6)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = lockoutSec > 0 ? 'none' : '0 10px 25px rgba(21, 84, 232, 0.4)';
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Institutional Clearance...</span>
                </>
              ) : lockoutSec > 0 ? (
                <span>Rate Limited ({lockoutSec}s remaining)</span>
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
