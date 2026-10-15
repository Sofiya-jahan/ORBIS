import React from 'react';

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
 * Renders the realistic dark enterprise architectural corridor/gateway image,
 * meticulously blended with ORBIS platform dark navy (#07112E) and the
 * active organization's multi-hue color palette (themeColor, secondaryColor, accentColor).
 * 
 * Multi-Zone Harmony:
 * - Left wing & acoustic glass: illuminated with secondaryColor
 * - Central doorway core: radiant interplay of accentColor, golden amber warmth, and themeColor
 * - Right wing & acoustic partition: illuminated with themeColor
 * - Floor reflection: multi-stop reflection mirroring the organization's full palette
 * - Vignette veil: WCAG-compliant contrast veil ensuring foreground readability
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
      style={{
        position: 'relative',
        width: '100%',
        height: height || (variant === 'fullscreen' ? '100vh' : 'auto'),
        minHeight: minHeight,
        borderRadius: variant === 'fullscreen' ? 0 : '24px',
        overflow: 'hidden',
        backgroundColor: '#07112E',
        border: variant === 'fullscreen' ? 'none' : '1px solid rgba(46, 155, 248, 0.22)',
        boxShadow: variant === 'fullscreen' 
          ? 'none' 
          : `0 20px 50px rgba(7, 17, 46, 0.9), 0 0 40px ${primaryAlpha(0.2)}`,
        ...style
      }}
    >
      {/* LAYER 1: Realistic Architectural Corridor Portal Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/corridor-portal.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%',
          backgroundRepeat: 'no-repeat',
          filter: 'contrast(1.1) brightness(0.94) saturate(1.15)',
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
          background: `linear-gradient(105deg, ${secondaryAlpha(0.32)} 0%, ${secondaryAlpha(0.14)} 35%, ${accentAlpha(0.22)} 58%, ${primaryAlpha(0.34)} 90%)`,
          mixBlendMode: 'soft-light',
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
          background: `radial-gradient(ellipse at 16% 48%, ${secondaryAlpha(0.4)} 0%, ${secondaryAlpha(0.18)} 35%, transparent 65%)`,
          mixBlendMode: 'color-dodge',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* 2B: Center Doorway Radiant Core (Accent Hue + Amber Warmth + Theme Hue) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 58% 46%, ${accentAlpha(0.5)} 0%, ${primaryAlpha(0.3)} 38%, transparent 70%)`,
          mixBlendMode: 'color-dodge',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* 2C: Right Wing Illumination (Theme Hue) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 88% 52%, ${primaryAlpha(0.45)} 0%, ${primaryAlpha(0.2)} 36%, transparent 68%)`,
          mixBlendMode: 'color-dodge',
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
          background: `linear-gradient(90deg, ${secondaryAlpha(0.25)} 0%, ${secondaryAlpha(0.15)} 25%, ${accentAlpha(0.32)} 56%, ${primaryAlpha(0.3)} 80%, ${primaryAlpha(0.2)} 100%)`,
          mixBlendMode: 'screen',
          filter: 'blur(28px)',
          opacity: 0.85,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* LAYER 4: Synchronized Doorway Perimeter Light Column (Warm Amber + Accent + Theme blend) */}
      <div
        style={{
          position: 'absolute',
          top: '7%',
          left: '58.4%',
          width: '6px',
          height: '63%',
          background: `linear-gradient(180deg, ${accentColor} 0%, #F59E0B 40%, #FFB84D 65%, ${themeColor} 100%)`,
          boxShadow: `0 0 25px 6px ${accentAlpha(0.55)}, 0 0 50px 18px ${primaryAlpha(0.35)}`,
          opacity: 0.72,
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
          background: `radial-gradient(ellipse at 25% 75%, ${accentAlpha(0.22)} 0%, ${secondaryAlpha(0.18)} 45%, transparent 75%)`,
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
          background: `radial-gradient(ellipse at 75% 75%, ${primaryAlpha(0.25)} 0%, ${accentAlpha(0.15)} 45%, transparent 75%)`,
          filter: 'blur(22px)',
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* LAYER 6: Platform Dark Navy Depth Fog & Readability Scrim */}
      {/* Carefully balanced to preserve corridor perspective while making foreground text & forms 100% legible */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: variant === 'fullscreen'
            ? 'linear-gradient(90deg, rgba(7, 17, 46, 0.94) 0%, rgba(7, 17, 46, 0.88) 28%, rgba(7, 17, 46, 0.62) 44%, rgba(7, 17, 46, 0.22) 58%, rgba(7, 17, 46, 0.52) 74%, rgba(7, 17, 46, 0.85) 90%, rgba(7, 17, 46, 0.94) 100%), linear-gradient(180deg, rgba(7, 17, 46, 0.8) 0%, transparent 16%, transparent 80%, rgba(7, 17, 46, 0.92) 100%)'
            : 'linear-gradient(90deg, rgba(7, 17, 46, 0.95) 0%, rgba(7, 17, 46, 0.72) 32%, rgba(7, 17, 46, 0.38) 55%, rgba(7, 17, 46, 0.82) 80%, rgba(7, 17, 46, 0.98) 100%), linear-gradient(180deg, rgba(7, 17, 46, 0.2) 0%, rgba(7, 17, 46, 0.75) 70%, rgba(7, 17, 46, 0.96) 100%)',
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
            background: 'rgba(7, 17, 46, 0.85)',
            border: `1px solid ${accentAlpha(0.35)}`,
            backdropFilter: 'blur(16px)',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: accentColor,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontFamily: "'JetBrains Mono', monospace",
            boxShadow: `0 0 20px ${primaryAlpha(0.25)}`
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
      `}</style>
    </div>
  );
};

export default OrganizationalPortalBackdrop;
