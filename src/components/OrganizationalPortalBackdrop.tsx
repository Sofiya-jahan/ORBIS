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
  /** Visual variant: 'banner' (for top headers), 'gateway' (focused card), 'fullscreen' (for auth/verification backdrops) */
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
 * meticulously blended with ORBIS platform dark navy (#07112E / #0D234D) and the
 * active organization's signature color palette (themeColor, secondaryColor, accentColor).
 * 
 * Features:
 * - Multi-layer photorealistic blending (vignette fog, color grading, ambient luminance)
 * - Synchronized vertical doorway edge glow harmonizing amber warmth with organization cyan/blue
 * - Acoustic glass refraction highlights
 * - Crisp WCAG-compliant high-contrast foreground container
 */
export const OrganizationalPortalBackdrop: React.FC<OrganizationalPortalBackdropProps> = ({
  themeColor = '#1554E8',
  secondaryColor = '#2E9BF8',
  accentColor = '#6AE7F7',
  height,
  minHeight = '320px',
  variant = 'banner',
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

  const orgTint = hexToRgba(themeColor, 0.35);
  const accentGlow = hexToRgba(accentColor, 0.45);
  const secondaryTint = hexToRgba(secondaryColor, 0.25);

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
          : `0 20px 50px rgba(7, 17, 46, 0.9), 0 0 40px ${hexToRgba(themeColor, 0.15)}`,
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
          backgroundPosition: 'center 38%',
          backgroundRepeat: 'no-repeat',
          filter: 'contrast(1.08) brightness(0.92) saturate(1.1)',
          transform: 'scale(1.02)',
          zIndex: 0,
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* LAYER 2: Organization Color Harmony Blend (Tints the dark architecture with organization hue) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 58% 45%, ${orgTint} 0%, ${secondaryTint} 40%, transparent 75%)`,
          mixBlendMode: 'color-dodge',
          opacity: 0.75,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* LAYER 3: Platform Dark Navy Ambient Vignette & Depth Fog (Melts image seamlessly into #07112E) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: variant === 'fullscreen'
            ? 'radial-gradient(circle at 50% 50%, rgba(7, 17, 46, 0.55) 0%, rgba(7, 17, 46, 0.88) 65%, #07112E 100%)'
            : 'linear-gradient(90deg, rgba(7, 17, 46, 0.95) 0%, rgba(7, 17, 46, 0.72) 32%, rgba(7, 17, 46, 0.45) 55%, rgba(7, 17, 46, 0.82) 80%, rgba(7, 17, 46, 0.98) 100%), linear-gradient(180deg, rgba(7, 17, 46, 0.25) 0%, rgba(7, 17, 46, 0.75) 70%, rgba(7, 17, 46, 0.96) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* LAYER 4: Synchronized Doorway Perimeter Light Column (Harmonizes natural warm amber with organization accent) */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '58.4%',
          width: '6px',
          height: '62%',
          background: `linear-gradient(180deg, ${accentColor} 0%, #F59E0B 45%, #FFB84D 65%, ${themeColor} 100%)`,
          boxShadow: `0 0 25px 6px ${accentGlow}, 0 0 50px 15px ${hexToRgba(themeColor, 0.35)}`,
          opacity: 0.65,
          borderRadius: '4px',
          zIndex: 3,
          pointerEvents: 'none',
          animation: 'portalDoorPulse 4s ease-in-out infinite alternate'
        }}
      />

      {/* LAYER 5: Acoustic Curved Glass Panels Specular Sheen (Left & Right curved partitions) */}
      <div
        style={{
          position: 'absolute',
          left: '2%',
          bottom: '10%',
          width: '180px',
          height: '240px',
          background: `radial-gradient(ellipse at 20% 80%, ${hexToRgba(accentColor, 0.15)} 0%, transparent 70%)`,
          filter: 'blur(20px)',
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '4%',
          bottom: '12%',
          width: '190px',
          height: '250px',
          background: `radial-gradient(ellipse at 80% 80%, ${hexToRgba(themeColor, 0.18)} 0%, transparent 70%)`,
          filter: 'blur(20px)',
          zIndex: 3,
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
            border: `1px solid ${hexToRgba(accentColor, 0.35)}`,
            backdropFilter: 'blur(16px)',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: accentColor,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontFamily: "'JetBrains Mono', monospace",
            boxShadow: `0 0 20px ${hexToRgba(themeColor, 0.25)}`
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

      {/* LAYER 6: Foreground Children Container */}
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
            opacity: 0.55;
            filter: blur(2px) drop-shadow(0 0 10px ${accentGlow});
          }
          50% {
            opacity: 0.85;
            filter: blur(3px) drop-shadow(0 0 22px ${accentGlow});
          }
          100% {
            opacity: 0.6;
            filter: blur(2px) drop-shadow(0 0 12px ${accentGlow});
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
