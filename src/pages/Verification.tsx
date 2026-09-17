import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldCheck, Loader2, Fingerprint, Lock, ShieldAlert } from 'lucide-react';

const Verification = () => {
  const navigate = useNavigate();
  const { organization, role, verifyPIN } = useAuthStore();
  
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto focus next
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto submit if all filled
    if (index === 5 && value && newPin.every(v => v !== '')) {
      handleSubmitPin(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmitPin = async (fullPin: string) => {
    if (fullPin.length !== 6) return;
    
    setIsLoading(true);

    const isValid = await verifyPIN(fullPin);
    
    if (isValid) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Wait for success animation
    } else {
      setError('Invalid Security PIN. Access Denied.');
      setIsLoading(false);
      setPin(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: error ? 'radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)' 
                  : success ? 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(var(--primary-rgb),0.05) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none', transition: 'all 0.5s ease'
      }} />

      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '3rem', position: 'relative', zIndex: 1, borderTop: `4px solid ${error ? 'var(--danger)' : success ? 'var(--success)' : 'var(--primary)'}` }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
          
          {/* Animated Shield/Icon */}
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '24px', 
            background: error ? 'rgba(239, 68, 68, 0.1)' : success ? 'rgba(16, 185, 129, 0.1)' : 'var(--primary-light)', 
            color: error ? 'var(--danger)' : success ? 'var(--success)' : 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: error ? '0 0 20px rgba(239, 68, 68, 0.2)' : success ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'var(--shadow-glow)',
            animation: success ? 'pulseGlow 2s infinite' : error ? 'shake 0.5s' : 'float 6s infinite ease-in-out',
            border: `1px solid ${error ? 'var(--danger)' : success ? 'var(--success)' : 'var(--primary)'}`
          }}>
            {error ? <ShieldAlert size={40} /> : success ? <ShieldCheck size={40} /> : <Fingerprint size={40} />}
          </div>
          
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>
            {success ? 'Access Granted' : 'Security Key Verification'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1.1rem' }}>
            {success ? 'Secure connection established. Redirecting...' : 'Enter your 6-digit authorization PIN'}
          </p>
        </div>

        {!success && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            
            {/* Identity Badge */}
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem', 
              padding: '0.75rem 1.5rem', borderRadius: '100px', 
              backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' 
            }}>
              <Lock size={16} color="var(--primary)" />
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Authenticating for:</span>
                <span style={{ fontWeight: '600', textTransform: 'capitalize', color: 'var(--text-primary)' }}>{organization} - {role}</span>
              </div>
            </div>

            {/* PIN Inputs */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', margin: '1rem 0' }}>
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  disabled={isLoading}
                  style={{
                    width: '56px', height: '64px',
                    fontSize: '2rem', textAlign: 'center', fontWeight: '700', fontFamily: 'var(--font-mono)',
                    borderRadius: '16px', border: '1px solid',
                    borderColor: error ? 'var(--danger)' : digit ? 'var(--primary)' : 'var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)',
                    boxShadow: digit && !error ? '0 0 10px rgba(var(--primary-rgb), 0.2)' : 'none',
                    transition: 'all 0.2s', outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : digit ? 'var(--primary)' : 'var(--border-color)'}
                />
              ))}
            </div>

            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '0.875rem', fontWeight: '500', animation: 'fadeIn 0.3s' }}>
                {error}
              </div>
            )}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <Loader2 size={20} className="animate-spin" />
                <span style={{ fontWeight: '500' }}>Validating credentials...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default Verification;
