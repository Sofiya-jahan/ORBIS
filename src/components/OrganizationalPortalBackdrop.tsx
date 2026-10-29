import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

export interface OrganizationalPortalBackdropProps {
  /** Organization primary theme color (e.g. #0B6EFD, #0D9488, etc.) */
  themeColor?: string;
  /** Organization secondary color */
  secondaryColor?: string;
  /** Organization electric accent color (e.g. #00E0FF, #6AE7F7, etc.) */
  accentColor?: string;
  /** Height of the portal frame (default: auto or 100%) */
  height?: string | number;
  /** Minimum height of the frame */
  minHeight?: string | number;
  /** Visual variant: 'banner' (for headers), 'gateway' (focused card), 'fullscreen' (for auth/login backdrops) */
  variant?: 'banner' | 'gateway' | 'fullscreen';
  /** Optional badge text shown in top corner */
  nodeBadgeText?: string;
  /** Custom children to render on top of the realistic blended portal */
  children?: React.ReactNode;
  /** Additional CSS styles for the outer container */
  style?: React.CSSProperties;
  /** Outer container class */
  className?: string;
}

/**
 * OrganizationalPortalBackdrop
 * 
 * Renders the realistic dark or light enterprise architectural corridor/gateway image,
 * meticulously blended with ORBIS platform theme (#07112E for Dark, #F7F9FC for Light)
 * and the active organization's multi-hue color palette (themeColor, secondaryColor, accentColor).
 */
export const OrganizationalPortalBackdrop: React.FC<OrganizationalPortalBackdropProps> = ({
  themeColor = '#1554E8',
  secondaryColor = '#2E9BF8',
  accentColor = '#6AE7F7',
  height,
  minHeight = '320px',
  variant = 'fullscreen',
  nodeBadgeText,
  children,
  style,
  className = ''
}) => {
  const { theme } = useAuthStore();
  const isLight = theme === 'light';

  // Convert hex color to rgba helper
  const hexToRgba = (hex: string, alpha: number) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16) || 21;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 84;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 232;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const primaryAlpha = (a: number) => hexToRgba(themeColor, a);
  const secondaryAlpha = (a: number) => hexToRgba(secondaryColor, a);
  const accentAlpha = (a: number) => hexToRgba(accentColor, a);

  return (
    <div
      className={`orbis-portal-frame ${className}`}
      data-portal-theme={isLight ? 'light' : 'dark'}
      style={{
        position: 'relative',
        width: '100%',
        height: height || (variant === 'fullscreen' ? '100vh' : 'auto'),
        minHeight: minHeight,
        borderRadius: variant === 'fullscreen' ? 0 : '24px',
        overflow: 'hidden',
        backgroundColor: isLight ? '#F7F9FC' : '#07112E',
        border: variant === 'fullscreen' 
          ? 'none' 
          : (isLight ? '1px solid #DCE5F2' : '1px solid rgba(46, 155, 248, 0.22)'),
        boxShadow: variant === 'fullscreen' 
          ? 'none' 
          : isLight
          ? `0 20px 50px rgba(23, 32, 51, 0.08), 0 0 40px ${primaryAlpha(0.08)}`
          : `0 20px 50px rgba(7, 17, 46, 0.9), 0 0 40px ${primaryAlpha(0.2)}`,
        ...style
      }}
    >
      {/* LAYER 1: Realistic Architectural Corridor Portal Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${isLight ? '/corridor-portal-light.png' : '/corridor-portal.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: isLight ? 'center 50%' : 'center 42%',
          backgroundRepeat: 'no-repeat',
          filter: isLight 
            ? 'contrast(1.04) brightness(1.02) saturate(1.06)' 
            : 'contrast(1.1) brightness(0.94) saturate(1.15)',
          transform: 'scale(1.02)',
          zIndex: 0,
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* LAYER 1B: Architectural Tonal Harmony (Color Palette Integration across walls & surfaces) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? `linear-gradient(105deg, ${secondaryAlpha(0.10)} 0%, ${secondaryAlpha(0.04)} 35%, ${accentAlpha(0.08)} 58%, ${primaryAlpha(0.12)} 90%)`
            : `linear-gradient(105deg, ${secondaryAlpha(0.32)} 0%, ${secondaryAlpha(0.14)} 35%, ${accentAlpha(0.22)} 58%, ${primaryAlpha(0.34)} 90%)`,
          mixBlendMode: isLight ? 'multiply' : 'soft-light',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* LAYER 2: Multi-Zone Organizational Color Palette Integration (Left=Secondary, Center=Accent, Right=Theme) */}
      {/* 2A: Left Wing Illumination (Secondary Hue) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? `radial-gradient(ellipse at 14% 48%, ${secondaryAlpha(0.22)} 0%, ${secondaryAlpha(0.07)} 40%, transparent 68%)`
            : `radial-gradient(ellipse at 16% 48%, ${secondaryAlpha(0.4)} 0%, ${secondaryAlpha(0.18)} 35%, transparent 65%)`,
          mixBlendMode: isLight ? 'multiply' : 'color-dodge',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* 2B: Center Doorway Radiant Core (Accent Hue + Amber Warmth + Theme Hue) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? `radial-gradient(ellipse at 58.5% 46%, ${accentAlpha(0.28)} 0%, rgba(251, 191, 36, 0.16) 28%, ${primaryAlpha(0.10)} 48%, transparent 72%)`
            : `radial-gradient(ellipse at 58% 46%, ${accentAlpha(0.5)} 0%, ${primaryAlpha(0.3)} 38%, transparent 70%)`,
          mixBlendMode: isLight ? 'color-dodge' : 'color-dodge',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* 2C: Right Wing Illumination (Theme Hue) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? `radial-gradient(ellipse at 88% 50%, ${primaryAlpha(0.22)} 0%, ${primaryAlpha(0.08)} 40%, transparent 68%)`
            : `radial-gradient(ellipse at 88% 52%, ${primaryAlpha(0.45)} 0%, ${primaryAlpha(0.2)} 36%, transparent 68%)`,
          mixBlendMode: isLight ? 'multiply' : 'color-dodge',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* LAYER 3: Reflective Floor Multi-Color Harmonizer (Bounces the organization palette across floor tiles) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '45%',
          background: isLight
            ? `linear-gradient(90deg, ${secondaryAlpha(0.12)} 0%, ${secondaryAlpha(0.05)} 30%, ${accentAlpha(0.24)} 57%, ${accentAlpha(0.28)} 59%, ${primaryAlpha(0.18)} 68%, ${primaryAlpha(0.08)} 100%)`
            : `linear-gradient(90deg, ${secondaryAlpha(0.25)} 0%, ${secondaryAlpha(0.15)} 25%, ${accentAlpha(0.32)} 56%, ${primaryAlpha(0.3)} 80%, ${primaryAlpha(0.2)} 100%)`,
          mixBlendMode: isLight ? 'multiply' : 'screen',
          filter: isLight ? 'blur(20px)' : 'blur(28px)',
          opacity: isLight ? 0.75 : 0.85,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* LAYER 4: Synchronized Doorway Perimeter Light Column (Warm Amber + Accent + Theme blend) */}
      <div
        style={{
          position: 'absolute',
          top: isLight ? '3%' : '7%',
          left: '58.4%',
          width: isLight ? '4px' : '6px',
          height: isLight ? '68%' : '63%',
          background: `linear-gradient(180deg, ${accentColor} 0%, #F59E0B 40%, #FFB84D 65%, ${themeColor} 100%)`,
          boxShadow: isLight
            ? `0 0 12px 2px ${accentAlpha(0.4)}, 0 0 24px 6px rgba(251, 191, 36, 0.25)`
            : `0 0 25px 6px ${accentAlpha(0.55)}, 0 0 50px 18px ${primaryAlpha(0.35)}`,
          opacity: isLight ? 0.75 : 0.72,
          borderRadius: '4px',
          zIndex: 3,
          pointerEvents: 'none',
          animation: 'portalDoorPulse 4s ease-in-out infinite alternate'
        }}
      />

      {/* LAYER 5: Acoustic Curved Glass Highlights (Left: Secondary / Accent; Right: Theme) */}
      <div
        style={{
          position: 'absolute',
          left: '1.5%',
          bottom: '8%',
          width: '200px',
          height: '260px',
          background: isLight
            ? `radial-gradient(ellipse at 25% 75%, ${accentAlpha(0.16)} 0%, ${secondaryAlpha(0.10)} 45%, transparent 75%)`
            : `radial-gradient(ellipse at 25% 75%, ${accentAlpha(0.22)} 0%, ${secondaryAlpha(0.18)} 45%, transparent 75%)`,
          mixBlendMode: isLight ? 'multiply' : 'normal',
          filter: 'blur(22px)',
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '3%',
          bottom: '10%',
          width: '210px',
          height: '270px',
          background: isLight
            ? `radial-gradient(ellipse at 75% 75%, ${primaryAlpha(0.18)} 0%, ${accentAlpha(0.10)} 45%, transparent 75%)`
            : `radial-gradient(ellipse at 75% 75%, ${primaryAlpha(0.25)} 0%, ${accentAlpha(0.15)} 45%, transparent 75%)`,
          mixBlendMode: isLight ? 'multiply' : 'normal',
          filter: 'blur(22px)',
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* LAYER 6: Platform Depth Fog & Readability Scrim (Dark Navy in dark mode, Executive Warm Light in light mode) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? (variant === 'fullscreen'
              ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.82) 28%, rgba(255, 255, 255, 0.45) 48%, rgba(255, 255, 255, 0.22) 58%, rgba(255, 255, 255, 0.65) 75%, rgba(255, 255, 255, 0.90) 90%, rgba(255, 255, 255, 0.96) 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 20%, transparent 75%, rgba(255, 255, 255, 0.85) 100%)'
              : 'linear-gradient(90deg, rgba(255, 255, 255, 0.93) 0%, rgba(255, 255, 255, 0.84) 30%, rgba(255, 255, 255, 0.40) 50%, rgba(255, 255, 255, 0.20) 58%, rgba(255, 255, 255, 0.68) 78%, rgba(255, 255, 255, 0.92) 92%, rgba(255, 255, 255, 0.96) 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.88) 100%)')
            : (variant === 'fullscreen'
              ? 'linear-gradient(90deg, rgba(7, 17, 46, 0.94) 0%, rgba(7, 17, 46, 0.88) 28%, rgba(7, 17, 46, 0.62) 44%, rgba(7, 17, 46, 0.22) 58%, rgba(7, 17, 46, 0.52) 74%, rgba(7, 17, 46, 0.85) 90%, rgba(7, 17, 46, 0.94) 100%), linear-gradient(180deg, rgba(7, 17, 46, 0.8) 0%, transparent 16%, transparent 80%, rgba(7, 17, 46, 0.92) 100%)'
              : 'linear-gradient(90deg, rgba(7, 17, 46, 0.95) 0%, rgba(7, 17, 46, 0.72) 32%, rgba(7, 17, 46, 0.38) 55%, rgba(7, 17, 46, 0.82) 80%, rgba(7, 17, 46, 0.98) 100%), linear-gradient(180deg, rgba(7, 17, 46, 0.2) 0%, rgba(7, 17, 46, 0.75) 70%, rgba(7, 17, 46, 0.96) 100%)'),
          zIndex: 4,
          pointerEvents: 'none'
        }}
      />

      {/* Optional Architectural Node Telemetry Badge */}
      {nodeBadgeText && (
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.5rem',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.9rem',
            borderRadius: '100px',
            background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(7, 17, 46, 0.85)',
            border: isLight ? `1px solid #DCE5F2` : `1px solid ${accentAlpha(0.35)}`,
            backdropFilter: 'blur(16px)',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: accentColor,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontFamily: "'JetBrains Mono', monospace",
            boxShadow: isLight ? '0 2px 8px rgba(23, 32, 51, 0.06)' : `0 0 20px ${primaryAlpha(0.25)}`
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
              animation: 'portalPulseDot 2s infinite'
            }}
          />
          <span>{nodeBadgeText}</span>
        </div>
      )}

      {/* LAYER 7: Foreground Children Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </div>

      {/* Embedded Dynamic Keyframe Animations */}
      <style>{`
        @keyframes portalDoorPulse {
          0% {
            opacity: 0.6;
            filter: blur(2px) drop-shadow(0 0 10px ${accentAlpha(0.5)});
          }
          50% {
            opacity: 0.9;
            filter: blur(3px) drop-shadow(0 0 24px ${accentAlpha(0.8)});
          }
          100% {
            opacity: 0.65;
            filter: blur(2px) drop-shadow(0 0 12px ${accentAlpha(0.5)});
          }
        }
        @keyframes portalPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .orbis-portal-frame[data-portal-theme="light"] h1,
        .orbis-portal-frame[data-portal-theme="light"] h2,
        .orbis-portal-frame[data-portal-theme="light"] h3,
        .orbis-portal-frame[data-portal-theme="light"] h4 {
          color: #172033 !important;
        }
        .orbis-portal-frame[data-portal-theme="light"] p {
          color: #52637A !important;
        }
      `}</style>
    </div>
  );
};

export default OrganizationalPortalBackdrop;
