import React from 'react';
import { useAuthStore, type ThemeMode } from '../store/useAuthStore';
import { Sun, Moon, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ThemeToggleProps {
  /** Visual variant: 'segmented' (3-pill group), 'compact' (icons only in pill), 'button' (single cycling button) */
  variant?: 'segmented' | 'compact' | 'button';
  /** Optional custom styles */
  style?: React.CSSProperties;
  /** Optional custom class name */
  className?: string;
  /** Show text labels alongside icons (in segmented mode) */
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  style,
  className = '',
  showLabels = false
}) => {
  const { theme, themeMode, setTheme } = useAuthStore();
  const isLight = theme === 'light';

  const modes: { id: ThemeMode; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop }
  ];

  if (variant === 'button') {
    // Single cycling button
    const cycleNext = () => {
      if (themeMode === 'dark') setTheme('light');
      else if (themeMode === 'light') setTheme('system');
      else setTheme('dark');
    };

    const CurrentIcon = themeMode === 'system' ? Laptop : (isLight ? Sun : Moon);

    return (
      <button
        type="button"
        onClick={cycleNext}
        className={`theme-toggle-btn ${className}`}
        title={`Theme: ${themeMode.toUpperCase()} (Click to cycle)`}
        aria-label={`Current theme: ${themeMode}. Click to switch theme.`}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isLight ? '#FFFFFF' : 'rgba(13, 35, 77, 0.75)',
          border: isLight ? '1px solid #DCE5F2' : '1px solid rgba(46, 155, 248, 0.3)',
          color: isLight ? '#172033' : '#6AE7F7',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isLight ? '0 2px 6px rgba(23, 32, 51, 0.05)' : '0 4px 15px rgba(0, 0, 0, 0.4)',
          ...style
        }}
      >
        <CurrentIcon size={17} />
      </button>
    );
  }

  // Segmented 3-option toggle pill
  return (
    <div
      role="radiogroup"
      aria-label="Theme mode selector"
      className={`theme-toggle-segmented ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px',
        borderRadius: '12px',
        background: isLight ? '#EEF3F9' : 'rgba(7, 17, 46, 0.85)',
        border: isLight ? '1px solid #DCE5F2' : '1px solid rgba(46, 155, 248, 0.25)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isLight ? '0 2px 8px rgba(23, 32, 51, 0.04)' : '0 4px 20px rgba(0, 0, 0, 0.35)',
        gap: '2px',
        ...style
      }}
    >
      {modes.map((m) => {
        const IconComponent = m.icon;
        const isActive = themeMode === m.id;

        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(m.id)}
            title={`Switch to ${m.label} Mode`}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              padding: showLabels ? '0.35rem 0.75rem' : '0.38rem 0.55rem',
              borderRadius: '9px',
              border: 'none',
              background: 'transparent',
              color: isActive
                ? (isLight ? '#1554E8' : '#6AE7F7')
                : (isLight ? '#52637A' : 'rgba(246, 253, 255, 0.6)'),
              fontSize: '0.74rem',
              fontWeight: isActive ? 700 : 500,
              fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
              cursor: 'pointer',
              zIndex: 1,
              transition: 'color 0.2s ease',
              outline: 'none'
            }}
          >
            {isActive && (
              <motion.div
                layoutId="theme-active-indicator"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9px',
                  background: isLight 
                    ? '#FFFFFF' 
                    : 'linear-gradient(135deg, rgba(21, 84, 232, 0.45) 0%, rgba(46, 155, 248, 0.35) 100%)',
                  border: isLight ? '1px solid #DCE5F2' : '1px solid rgba(106, 231, 247, 0.4)',
                  boxShadow: isLight 
                    ? '0 2px 6px rgba(23, 32, 51, 0.08)' 
                    : '0 0 14px rgba(21, 84, 232, 0.4)',
                  zIndex: -1
                }}
              />
            )}
            <IconComponent size={14} />
            {showLabels && <span>{m.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
