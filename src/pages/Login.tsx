import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';
import { 
  ShieldCheck, Loader2, Lock, ArrowRight, Activity, 
  ChevronLeft, Sparkles, Mail, Eye, EyeOff, User, 
  BarChart3, HeartPulse, Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isCreateAccountMode = searchParams.get('mode') === 'signup' || searchParams.get('mode') === 'create-account';

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isSignUp, setIsSignUp] = useState(isCreateAccountMode);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, loginWithGoogle, isAuthenticated, organization, role } = useAuthStore();

  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const currentRole = currentOrg.roles.find(r => r.id === role) || currentOrg.roles[0];

  useEffect(() => {
    // If already fully authenticated, proceed to dashboard
    if (isAuthenticated && organization && role) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, organization, role, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp && confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await register(email, password, fullName);
      } else {
        await login(email, password);
      }
      navigate('/authentication');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/authentication');
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      let errorMsg = 'Google authentication failed. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Sign-in cancelled: Google authentication window was closed.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMsg = 'Pop-up blocked by browser. Please allow popups for this site.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'Google provider is not enabled in Firebase Console. Please enable Google in Firebase Authentication > Sign-in method.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = 'Network connectivity issue during Google authentication.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail(`executive@${currentOrg.id}.iprap.ai`);
    setPassword('enterprise2026');
  };

  // Sector-tailored 2x2 surveillance features
  const sectorFeatures = [
    {
      icon: BarChart3,
      title: 'Predict',
      desc: 'Identify risk patterns before they escalate'
    },
    {
      icon: HeartPulse,
      title: 'Monitor',
      desc: 'Real-time patient vitals & anomalies'
    },
    {
      icon: ShieldCheck,
      title: 'Prevent',
      desc: 'Reduce clinical & operational risks'
    },
    {
      icon: Share2,
      title: 'Coordinate',
      desc: 'Unified command for healthcare systems'
    }
  ];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      position: 'relative',
      backgroundImage: 'url(/login-portal-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#050B0D',
      fontFamily: "'Times New Roman', Times, serif",
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box'
    }}>
      
      {/* Cinematic Contrast Vignette Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(5, 11, 13, 0.92) 0%, rgba(5, 11, 13, 0.72) 42%, rgba(5, 11, 13, 0.28) 65%, rgba(5, 11, 13, 0.82) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Subtle Ambient Radial Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* TOP HEADER NAVIGATION */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.4rem 3.5rem',
        boxSizing: 'border-box',
        height: '76px'
      }}>
        {/* Brand Lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            background: 'rgba(10, 26, 28, 0.85)',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
            color: '#34D399'
          }}>
            <Activity size={20} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              letterSpacing: '1.2px',
              fontFamily: "'Times New Roman', Times, serif",
              color: '#FFFFFF',
              lineHeight: 1.1
            }}>
              IPRAP
            </div>
            <div style={{
              fontSize: '0.66rem',
              color: '#34D399',
              letterSpacing: '1.8px',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontFamily: "'Space Mono', monospace"
            }}>
              {currentOrg.sector || 'HEALTHCARE & LIFE SCIENCES'}
            </div>
          </div>

          <button
            onClick={() => navigate('/role-selection')}
            style={{
              marginLeft: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'rgba(12, 28, 33, 0.65)',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              borderRadius: '8px',
              padding: '0.3rem 0.65rem',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontFamily: "'Space Mono', monospace",
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = '#10B981';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.25)';
            }}
          >
            <ChevronLeft size={13} /> Change Sector
          </button>
        </div>

        {/* Top-Right Badge: Secure Institutional Access */}
        <div style={{
          background: 'rgba(8, 20, 24, 0.85)',
          border: '1px solid rgba(20, 184, 166, 0.35)',
          borderRadius: '999px',
          padding: '0.45rem 1rem',
          backdropFilter: 'blur(15px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 0 18px rgba(16, 185, 129, 0.18)'
        }}>
          <div style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 8px #10B981'
          }} />
          <span style={{
            fontSize: '0.72rem',
            color: '#E2E8F0',
            fontFamily: "'Space Mono', monospace",
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}>
            Secure Institutional Access
          </span>
        </div>
      </header>

      {/* MAIN TWO-COLUMN VIEWPORT CONTENT */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 3.5rem',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        
        {/* LEFT COLUMN: HERO INTELLIGENCE OVERVIEW */}
        <div style={{
          flex: '1 1 52%',
          maxWidth: '560px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 5
        }}>
          
          {/* Eyebrow Tagline */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
            color: '#94A3B8',
            fontSize: '0.7rem',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700
          }}>
            <span>GLOBAL SOVEREIGN & CAPITAL DEFENSE</span>
            <div style={{ width: '32px', height: '1px', background: 'rgba(255, 255, 255, 0.25)' }} />
          </div>

          {/* Majestic Hero Headline */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 3.8vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.5px',
            color: '#FFFFFF',
            margin: '0 0 0.8rem 0',
            fontFamily: "'Times New Roman', Times, serif"
          }}>
            Autonomous<br />
            <span style={{
              color: '#86EFAC',
              background: 'linear-gradient(135deg, #A7F3D0 0%, #34D399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              {currentOrg.sector ? currentOrg.sector.split(' ')[0] : 'Healthcare'}
            </span><br />
            Surveillance
          </h1>

          {/* Subtitle Description */}
          <p style={{
            color: '#94A3B8',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            maxWidth: '480px',
            margin: '0 0 1.25rem 0'
          }}>
            {currentOrg.description || 'Clinical risk surveillance, patient vitals predictive analytics, infection monitoring and institutional intelligence.'}
          </p>

          {/* 2x2 Feature Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.85rem',
            maxWidth: '500px',
            marginBottom: '1.25rem'
          }}>
            {sectorFeatures.map((feat, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: 'rgba(10, 24, 28, 0.75)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34D399',
                  flexShrink: 0,
                  boxShadow: '0 0 14px rgba(16, 185, 129, 0.15)'
                }}>
                  <feat.icon size={17} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '0.15rem',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}>
                    {feat.title}
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#94A3B8',
                    lineHeight: 1.32
                  }}>
                    {feat.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Live Metrics */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.6rem',
            paddingTop: '0.4rem'
          }}>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', fontFamily: "'Space Mono', monospace" }}>
                180+
              </div>
              <div style={{ fontSize: '0.6rem', color: '#94A3B8', letterSpacing: '1.2px', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>
                INSTITUTIONS
              </div>
            </div>
            <div style={{ width: '1px', height: '22px', background: 'rgba(255, 255, 255, 0.15)' }} />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', fontFamily: "'Space Mono', monospace" }}>
                24/7
              </div>
              <div style={{ fontSize: '0.6rem', color: '#94A3B8', letterSpacing: '1.2px', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>
                SURVEILLANCE
              </div>
            </div>
            <div style={{ width: '1px', height: '22px', background: 'rgba(255, 255, 255, 0.15)' }} />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', fontFamily: "'Space Mono', monospace" }}>
                99.9%
              </div>
              <div style={{ fontSize: '0.6rem', color: '#94A3B8', letterSpacing: '1.2px', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>
                SYSTEM UPTIME
              </div>
            </div>
          </div>

        </div>

        {/* CENTER DECORATIVE PORTAL MOTTO */}
        <div style={{
          position: 'absolute',
          left: '52%',
          top: '35%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          pointerEvents: 'none',
          opacity: 0.68,
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.68rem',
          letterSpacing: '3px',
          color: '#94A3B8',
          textTransform: 'uppercase',
          lineHeight: 1.45,
          zIndex: 3
        }}>
          <div>DATA</div>
          <div>PEOPLE</div>
          <div>SYSTEMS</div>
          <div>SAFER</div>
          <div>TOGETHER</div>
          <div style={{ width: '18px', height: '1px', background: 'rgba(255, 255, 255, 0.35)', marginTop: '0.3rem' }} />
        </div>

        {/* RIGHT COLUMN: ULTRA-PREMIUM GLASSMORPHIC LOGIN CARD */}
        <div style={{
          flex: '0 0 410px',
          width: '410px',
          zIndex: 10,
          background: 'rgba(8, 20, 24, 0.84)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(20, 184, 166, 0.28)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(16, 185, 129, 0.15)',
          padding: '1.75rem 2rem',
          boxSizing: 'border-box'
        }}>
          
          {/* Card Header */}
          <div style={{ marginBottom: '0.9rem' }}>
            <div style={{
              fontSize: '0.78rem',
              color: '#86EFAC',
              letterSpacing: '0.5px',
              marginBottom: '0.15rem',
              fontFamily: "'Space Mono', monospace"
            }}>
              Welcome to
            </div>
            <h2 style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '1px',
              margin: 0,
              fontFamily: "'Times New Roman', Times, serif"
            }}>
              IPRAP
            </h2>
            <div style={{
              fontSize: '0.74rem',
              color: '#34D399',
              letterSpacing: '0.8px',
              fontFamily: "'Space Mono', monospace",
              marginTop: '0.2rem'
            }}>
              {currentOrg.name ? `${currentOrg.name.split(' ')[0]} Command Portal` : 'Healthcare Command Portal'}
            </div>
          </div>

          {/* Mode Switcher: Sign In vs Create Account */}
          <div style={{
            display: 'flex',
            background: 'rgba(12, 28, 33, 0.9)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(20, 184, 166, 0.2)',
            marginBottom: '0.85rem'
          }}>
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(''); }}
              style={{
                flex: 1,
                padding: '0.36rem',
                borderRadius: '7px',
                border: 'none',
                background: !isSignUp ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
                color: !isSignUp ? '#FFFFFF' : '#94A3B8',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontFamily: "'Times New Roman', Times, serif",
                transition: 'all 0.2s',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(''); }}
              style={{
                flex: 1,
                padding: '0.36rem',
                borderRadius: '7px',
                border: 'none',
                background: isSignUp ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
                color: isSignUp ? '#FFFFFF' : '#94A3B8',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontFamily: "'Times New Roman', Times, serif",
                transition: 'all 0.2s',
              }}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                color: '#FCA5A5',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                marginBottom: '0.65rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                fontFamily: "'Space Mono', monospace"
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Login / Registration Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Full Name (Sign Up only) */}
            {isSignUp && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.62rem 0.9rem',
                borderRadius: '11px',
                background: 'rgba(10, 24, 28, 0.65)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                marginBottom: '0.6rem'
              }}>
                <User size={16} color="#34D399" />
                <input
                  type="text"
                  placeholder="Officer / Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    outline: 'none',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>
            )}

            {/* Email Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.62rem 0.9rem',
              borderRadius: '11px',
              background: 'rgba(10, 24, 28, 0.65)',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              marginBottom: '0.6rem'
            }}>
              <Mail size={16} color="#34D399" />
              <input
                type="email"
                placeholder="Institutional Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.62rem 0.9rem',
              borderRadius: '11px',
              background: 'rgba(10, 24, 28, 0.65)',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              marginBottom: isSignUp ? '0.6rem' : '0.75rem'
            }}>
              <Lock size={16} color="#34D399" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0, display: 'flex' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.62rem 0.9rem',
                borderRadius: '11px',
                background: 'rgba(10, 24, 28, 0.65)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                marginBottom: '0.75rem'
              }}>
                <Lock size={16} color="#34D399" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    outline: 'none',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>
            )}

            {/* Options Row: Remember device & Autofill Demo */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
              fontSize: '0.78rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: '#94A3B8' }}>
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  style={{ accentColor: '#10B981', cursor: 'pointer' }}
                />
                <span>Remember this device</span>
              </label>

              {!isSignUp ? (
                <button
                  type="button"
                  onClick={handleDemoFill}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#34D399',
                    cursor: 'pointer',
                    fontWeight: 600,
                    padding: 0,
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  <Sparkles size={11} color="#34D399" /> Autofill demo?
                </button>
              ) : (
                <span style={{ color: '#64748B', fontSize: '0.72rem' }}>Encrypted AES-256</span>
              )}
            </div>

            {/* Primary Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: '0 0 25px rgba(16, 185, 129, 0.55)' }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.72rem',
                borderRadius: '11px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: 700,
                fontFamily: "'Times New Roman', Times, serif",
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)',
                marginBottom: '0.85rem'
              }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.85rem'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            <span style={{ fontSize: '0.68rem', color: '#64748B', fontFamily: "'Space Mono', monospace" }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          </div>

          {/* Social Sign In: ONLY Google (Microsoft removed as requested) */}
          <motion.button
            whileHover={{
              scale: 1.01,
              backgroundColor: 'rgba(15, 32, 38, 0.95)',
              borderColor: 'rgba(16, 185, 129, 0.45)'
            }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: '11px',
              background: 'rgba(10, 24, 28, 0.75)',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              color: '#FFFFFF',
              fontSize: '0.86rem',
              fontWeight: 600,
              fontFamily: "'Times New Roman', Times, serif",
              cursor: (loading || googleLoading) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              marginBottom: '0.95rem',
              transition: 'all 0.2s'
            }}
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin" color="#10B981" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            )}
            <span>{googleLoading ? 'Connecting to Google...' : (isSignUp ? 'Sign up with Google' : 'Google')}</span>
          </motion.button>

          {/* Card Footer Security Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            fontSize: '0.66rem',
            color: '#64748B',
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.4px'
          }}>
            <Lock size={12} color="#64748B" />
            <span>Encrypted · Role-based Access · Institutional Security</span>
          </div>

        </div>

      </main>

      {/* FOOTER BAR (Clean, non-intrusive bottom padding) */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        height: '24px',
        boxSizing: 'border-box'
      }} />

    </div>
  );
};

export default Login;
