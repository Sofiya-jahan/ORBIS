import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Lock, Unlock, ShieldCheck, Activity, 
  Sparkles, SkipForward, ChevronDown, Radio, Compass
} from 'lucide-react';

interface IntroProps {
  onComplete: () => void;
}

const TOTAL_FRAMES = 300;
const FPS = 30;

export const CinematicIntro: React.FC<IntroProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const targetFrameRef = useRef(0);
  const animatedFrameRef = useRef(0);
  const rafId = useRef<number | null>(null);

  // Smooth scroll scrubbing handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      const target = Math.min(TOTAL_FRAMES, Math.floor(progress * TOTAL_FRAMES));
      targetFrameRef.current = target;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Butter-smooth frame interpolation loop (lerping towards targetFrame at 60fps)
  useEffect(() => {
    const loop = () => {
      const diff = targetFrameRef.current - animatedFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        animatedFrameRef.current += diff * 0.18; // smooth spring damping
      } else {
        animatedFrameRef.current = targetFrameRef.current;
      }

      const frameInt = Math.min(TOTAL_FRAMES, Math.max(0, Math.round(animatedFrameRef.current)));
      setCurrentFrame(frameInt);

      // Auto-trigger completion at end of 300-frame scroll
      if (frameInt >= TOTAL_FRAMES && !isCompleted) {
        setIsCompleted(true);
        setTimeout(() => {
          onComplete();
        }, 800);
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isCompleted, onComplete]);

  // High-DPI Procedural 300-Frame Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main 300-Frame Procedural Animation Draw Function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const frame = animatedFrameRef.current;
    const p = Math.min(1, Math.max(0, frame / TOTAL_FRAMES));

    // Reset Canvas
    ctx.clearRect(0, 0, width, height);

    // Zoom factor during final stage (frames 250-300)
    let zoom = 1;
    if (p > 0.83) {
      const zoomP = (p - 0.83) / 0.17;
      zoom = 1 + zoomP * 1.6;
    }

    ctx.save();
    const cx = width / 2;
    const cy = height * 0.48;

    // Apply camera dolly zoom centered on portal
    ctx.translate(cx, cy);
    ctx.scale(zoom, zoom);
    ctx.translate(-cx, -cy);

    // 1. BASE BACKGROUND: Layered Dark Navy (#07112E -> #0D234D)
    const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, width * 0.8);
    bgGrad.addColorStop(0, p > 0.4 ? '#0D234D' : '#07112E');
    bgGrad.addColorStop(0.6, '#07112E');
    bgGrad.addColorStop(1, '#040A1C');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. FLOOR PERSPECTIVE GRID: Radiant Sky Blue & Cyan Horizon
    const floorY = cy + 40;
    const gridCols = 18;
    ctx.lineWidth = 1;

    for (let i = -gridCols; i <= gridCols; i++) {
      const startX = cx + i * (width / (gridCols * 3.5));
      const endX = cx + i * (width * 0.9);
      
      const gridGrad = ctx.createLinearGradient(startX, floorY, endX, height);
      gridGrad.addColorStop(0, 'rgba(106, 231, 247, 0.45)');
      gridGrad.addColorStop(0.7, p > 0.3 ? 'rgba(46, 155, 248, 0.3)' : 'rgba(21, 84, 232, 0.22)');
      gridGrad.addColorStop(1, 'transparent');

      ctx.strokeStyle = gridGrad;
      ctx.beginPath();
      ctx.moveTo(startX, floorY);
      ctx.lineTo(endX, height);
      ctx.stroke();
    }

    // Horizontal perspective lines on floor
    const horizCount = 14;
    for (let j = 1; j <= horizCount; j++) {
      const tNorm = Math.pow(j / horizCount, 2.2);
      const hy = floorY + tNorm * (height - floorY);
      
      ctx.strokeStyle = `rgba(106, 231, 247, ${0.35 * (1 - tNorm * 0.7)})`;
      ctx.beginPath();
      ctx.moveTo(0, hy);
      ctx.lineTo(width, hy);
      ctx.stroke();
    }

    // 3. ARCHITECTURAL PORTAL GEOMETRY
    const portalW = Math.min(480, width * 0.36);
    const portalH = Math.min(680, height * 0.72);
    const portalLeft = cx - portalW / 2;
    const portalTop = cy - portalH / 2;

    // Portal Outer Chamfered Arch Frame
    ctx.strokeStyle = 'rgba(46, 155, 248, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(portalLeft - 18, portalTop - 18, portalW + 36, portalH + 36);

    ctx.strokeStyle = 'rgba(106, 231, 247, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(portalLeft - 28, portalTop - 28, portalW + 56, portalH + 56);

    // 4. BLAST GATES & OPENING MECHANISM (Frames 0 to 300)
    // - Phase 1 (0 to 80): Doors sealed, central lock rotates and calibrations complete
    // - Phase 2 (81 to 240): Dual doors slide laterally open, light pours outward
    // - Phase 3 (241 to 300): Doors wide open, volumetric light bloom expands
    let doorOpenOffset = 0;
    if (p > 0.25) {
      const openP = Math.min(1, (p - 0.25) / 0.60);
      // Smooth cubic easing for heavy mechanical blast doors
      const ease = openP < 0.5 ? 4 * openP * openP * openP : 1 - Math.pow(-2 * openP + 2, 3) / 2;
      doorOpenOffset = ease * (portalW * 0.55);
    }

    // A. INNER RADIANT DIMENSION (Visible as doors open)
    if (doorOpenOffset > 2) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(portalLeft, portalTop, portalW, portalH);
      ctx.clip();

      // Deep Electric Sapphire & Cyan Volumetric Core
      const innerGrad = ctx.createLinearGradient(cx, portalTop, cx, portalTop + portalH);
      innerGrad.addColorStop(0, '#1554E8');
      innerGrad.addColorStop(0.35, '#4148F1');
      innerGrad.addColorStop(0.7, '#7A48FF');
      innerGrad.addColorStop(1, '#6AE7F7');
      ctx.fillStyle = innerGrad;
      ctx.fillRect(portalLeft, portalTop, portalW, portalH);

      // Sapphire & Cyan Volumetric Light Ray Beams
      const beamSpread = doorOpenOffset * 2.2;
      const beamGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, beamSpread);
      beamGrad.addColorStop(0, 'rgba(246, 253, 255, 0.95)');
      beamGrad.addColorStop(0.3, 'rgba(46, 155, 248, 0.7)');
      beamGrad.addColorStop(0.7, 'rgba(106, 231, 247, 0.35)');
      beamGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(portalLeft, portalTop, portalW, portalH);

      // Quantum Grid matrix within the open doorway
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      const step = 28;
      for (let gx = portalLeft; gx < portalLeft + portalW; gx += step) {
        ctx.beginPath();
        ctx.moveTo(gx, portalTop);
        ctx.lineTo(gx, portalTop + portalH);
        ctx.stroke();
      }
      for (let gy = portalTop; gy < portalTop + portalH; gy += step) {
        ctx.beginPath();
        ctx.moveTo(portalLeft, gy);
        ctx.lineTo(portalLeft + portalW, gy);
        ctx.stroke();
      }

      ctx.restore();

      // Light Reflections spilling across the floor
      const floorLightGrad = ctx.createRadialGradient(cx, floorY, 10, cx, height, portalW * 1.6);
      floorLightGrad.addColorStop(0, `rgba(46, 155, 248, ${0.7 * (doorOpenOffset / (portalW * 0.55))})`);
      floorLightGrad.addColorStop(0.4, `rgba(21, 84, 232, ${0.45 * (doorOpenOffset / (portalW * 0.55))})`);
      floorLightGrad.addColorStop(0.8, 'rgba(106, 231, 247, 0.18)');
      floorLightGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = floorLightGrad;
      ctx.fillRect(0, floorY, width, height - floorY);
    }

    // B. LEFT MONOLITH BLAST DOOR
    ctx.save();
    ctx.translate(-doorOpenOffset, 0);

    const leftDoorW = portalW / 2;
    const leftDoorGrad = ctx.createLinearGradient(portalLeft, portalTop, portalLeft + leftDoorW, portalTop);
    leftDoorGrad.addColorStop(0, '#07112E');
    leftDoorGrad.addColorStop(0.6, '#0D234D');
    leftDoorGrad.addColorStop(1, '#050D24');
    ctx.fillStyle = leftDoorGrad;
    ctx.fillRect(portalLeft, portalTop, leftDoorW, portalH);

    // Left door metallic armor ridges & border
    ctx.strokeStyle = 'rgba(46, 155, 248, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(portalLeft, portalTop, leftDoorW, portalH);

    for (let r = 1; r <= 6; r++) {
      const ry = portalTop + r * (portalH / 7);
      ctx.strokeStyle = 'rgba(217, 251, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(portalLeft + 12, ry);
      ctx.lineTo(portalLeft + leftDoorW - 8, ry);
      ctx.stroke();
    }

    ctx.restore();

    // C. RIGHT MONOLITH BLAST DOOR
    ctx.save();
    ctx.translate(doorOpenOffset, 0);

    const rightDoorW = portalW / 2;
    const rightDoorX = cx;
    const rightDoorGrad = ctx.createLinearGradient(rightDoorX, portalTop, rightDoorX + rightDoorW, portalTop);
    rightDoorGrad.addColorStop(0, '#050D24');
    rightDoorGrad.addColorStop(0.4, '#0D234D');
    rightDoorGrad.addColorStop(1, '#07112E');
    ctx.fillStyle = rightDoorGrad;
    ctx.fillRect(rightDoorX, portalTop, rightDoorW, portalH);

    // Right door metallic armor ridges & border
    ctx.strokeStyle = 'rgba(46, 155, 248, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rightDoorX, portalTop, rightDoorW, portalH);

    for (let r = 1; r <= 6; r++) {
      const ry = portalTop + r * (portalH / 7);
      ctx.strokeStyle = 'rgba(217, 251, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(rightDoorX + 8, ry);
      ctx.lineTo(rightDoorX + rightDoorW - 12, ry);
      ctx.stroke();
    }

    ctx.restore();

    // 5. CENTRAL BIOMETRIC VAULT SEAL (Frames 0 to 80 active, then parts in half)
    const lockRadius = 80;
    const lockAngle = (p * Math.PI * 4); // Rotates with scroll

    // Render Left Half of Lock
    ctx.save();
    ctx.translate(cx - doorOpenOffset, cy);
    ctx.beginPath();
    ctx.arc(0, 0, lockRadius, Math.PI / 2, Math.PI * 1.5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(7, 17, 46, 0.96)';
    ctx.fill();
    ctx.strokeStyle = p < 0.25 ? '#6AE7F7' : '#2E9BF8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ticks on left lock half
    for (let a = Math.PI / 2; a <= Math.PI * 1.5; a += Math.PI / 8) {
      const tx1 = Math.cos(a + lockAngle) * (lockRadius - 12);
      const ty1 = Math.sin(a + lockAngle) * (lockRadius - 12);
      const tx2 = Math.cos(a + lockAngle) * (lockRadius - 4);
      const ty2 = Math.sin(a + lockAngle) * (lockRadius - 4);
      ctx.beginPath();
      ctx.moveTo(tx1, ty1);
      ctx.lineTo(tx2, ty2);
      ctx.stroke();
    }
    ctx.restore();

    // Render Right Half of Lock
    ctx.save();
    ctx.translate(cx + doorOpenOffset, cy);
    ctx.beginPath();
    ctx.arc(0, 0, lockRadius, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(7, 17, 46, 0.96)';
    ctx.fill();
    ctx.strokeStyle = p < 0.25 ? '#6AE7F7' : '#2E9BF8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ticks on right lock half
    for (let a = -Math.PI / 2; a <= Math.PI / 2; a += Math.PI / 8) {
      const tx1 = Math.cos(a + lockAngle) * (lockRadius - 12);
      const ty1 = Math.sin(a + lockAngle) * (lockRadius - 12);
      const tx2 = Math.cos(a + lockAngle) * (lockRadius - 4);
      const ty2 = Math.sin(a + lockAngle) * (lockRadius - 4);
      ctx.beginPath();
      ctx.moveTo(tx1, ty1);
      ctx.lineTo(tx2, ty2);
      ctx.stroke();
    }
    ctx.restore();

    // 6. VOLUMETRIC FLASH / BLOOM (Frames 270 to 300)
    if (p > 0.88) {
      const bloomP = (p - 0.88) / 0.12;
      ctx.fillStyle = `rgba(255, 255, 255, ${bloomP * 0.85})`;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
  }, []);

  // Compute textual milestone indicator
  const getPhaseDescription = (frame: number) => {
    if (frame <= 60) return { title: 'CALIBRATING SECURITY LATTICE', sub: 'ALIGNING 256-BIT HYDRAULIC LOCKS', progress: 'Phase 1/5' };
    if (frame <= 130) return { title: 'DECOUPLING BIOMETRIC SEALS', sub: 'PRESSURE EQUALIZATION IN PROGRESS', progress: 'Phase 2/5' };
    if (frame <= 200) return { title: 'UNSEALING SOVEREIGN BLAST DOORS', sub: 'DISPERSING VOLUMETRIC SAPPHIRE CORE', progress: 'Phase 3/5' };
    if (frame <= 265) return { title: 'PORTAL THRESHOLD DILATION', sub: 'ESTABLISHING TELEMETRY CONNECTION', progress: 'Phase 4/5' };
    return { title: 'SOVEREIGN ACCESS GRANTED', sub: 'INITIALIZING ENTERPRISE PLATFORM', progress: 'Phase 5/5' };
  };

  const phase = getPhaseDescription(currentFrame);
  const timeSeconds = (currentFrame / FPS).toFixed(2);

  return (
    <div
      ref={containerRef}
      style={{
        height: '420vh', // Extended scroll track for 300 deliberate, cinematic frames
        position: 'relative',
        background: '#07112E',
        fontFamily: "'Inter', sans-serif",
        color: '#F6FDFF'
      }}
    >
      
      {/* FIXED 100VH CINEMATIC STAGE */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 10,
        pointerEvents: 'auto'
      }}>
        
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        />

        {/* TOP HUD BAR */}
        <header style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '1.8rem 3.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
          boxSizing: 'border-box'
        }}>
          {/* Brand & Technical Timebase Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: '11px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.45)',
              border: '1px solid rgba(59, 130, 246, 0.4)'
            }}>
              <img src="/orbis-logo.png" alt="ORBIS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '1px', color: '#F6FDFF', lineHeight: 1.1 }}>
                ORBIS <span style={{ color: '#2E9BF8', fontSize: '0.85rem', fontStyle: 'italic' }}>// SOVEREIGN GATE</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#6AE7F7', letterSpacing: '1.5px', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                SCROLL REVEAL ENGINE • 300 FRAMES @ 30 FPS
              </div>
            </div>
          </div>

          {/* Direct Skip Action */}
          <button
            onClick={() => onComplete()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.3rem',
              background: 'rgba(7, 17, 46, 0.85)',
              border: '1px solid rgba(46, 155, 248, 0.35)',
              borderRadius: '12px',
              color: '#F6FDFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              backdropFilter: 'blur(15px)',
              transition: 'all 0.2s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = '#6AE7F7';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(106, 231, 247, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'rgba(46, 155, 248, 0.35)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
            }}
          >
            <span>Skip to Application</span>
            <SkipForward size={14} color="#6AE7F7" />
          </button>
        </header>

        {/* CENTER PROMPT (During early scroll frames) */}
        {currentFrame < 70 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              bottom: '12%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.65rem',
              pointerEvents: 'none'
            }}
          >
            <div style={{
              background: 'rgba(7, 17, 46, 0.88)',
              border: '1px solid rgba(106, 231, 247, 0.4)',
              borderRadius: '999px',
              padding: '0.55rem 1.4rem',
              backdropFilter: 'blur(15px)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 0 25px rgba(21, 84, 232, 0.35)'
            }}>
              <Compass size={14} color="#6AE7F7" className="animate-spin" />
              <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#F6FDFF', letterSpacing: '1px' }}>
                SCROLL TO UNSEAL PORTAL
              </span>
            </div>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              <ChevronDown size={20} color="#6AE7F7" />
            </motion.div>
          </motion.div>
        )}

        {/* BOTTOM TELEMETRY FOOTER HUD */}
        <footer style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem 3.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          zIndex: 20,
          boxSizing: 'border-box',
          pointerEvents: 'none'
        }}>
          {/* Left Milestone Status */}
          <div style={{ maxWidth: '400px' }}>
            <div style={{ fontSize: '0.68rem', color: '#6AE7F7', fontFamily: "'Space Mono', monospace", fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              {phase.progress} // {phase.title}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F6FDFF', fontFamily: "'Inter', sans-serif" }}>
              {phase.sub}
            </div>
          </div>

          {/* Right Frame Counter & Scrub Progress */}
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(246, 253, 255, 0.65)', fontFamily: "'Space Mono', monospace" }}>
                TC: 00:{String(Math.floor(currentFrame / FPS)).padStart(2, '0')}:{String(currentFrame % FPS).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: currentFrame >= 270 ? '#6AE7F7' : '#F6FDFF',
                fontFamily: "'Space Mono', monospace",
                letterSpacing: '1px'
              }}>
                FRAME [{String(currentFrame).padStart(3, '0')} / {TOTAL_FRAMES}]
              </div>
            </div>

            {/* Scrub Progress Track */}
            <div style={{
              width: '260px',
              height: '5px',
              background: 'rgba(246, 253, 255, 0.1)',
              borderRadius: '3px',
              overflow: 'hidden',
              border: '1px solid rgba(46, 155, 248, 0.25)'
            }}>
              <div style={{
                width: `${(currentFrame / TOTAL_FRAMES) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #1554E8 0%, #2E9BF8 50%, #6AE7F7 100%)',
                boxShadow: '0 0 10px #2E9BF8',
                transition: 'width 0.05s ease-out'
              }} />
            </div>

            <div style={{ fontSize: '0.65rem', color: '#6AE7F7', fontFamily: "'Space Mono', monospace" }}>
              {Math.round((currentFrame / TOTAL_FRAMES) * 100)}% UNSEALED • 30 FPS SCRUB
            </div>
          </div>
        </footer>

        {/* ENTER APPLICATION BUTTON (Appears near the end of scroll) */}
        {currentFrame >= 240 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute',
              top: '52%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 30
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 45px rgba(46, 155, 248, 0.7)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onComplete()}
              style={{
                padding: '1.2rem 2.8rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)',
                color: '#F6FDFF',
                border: '1px solid rgba(246, 253, 255, 0.4)',
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '1px',
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 15px 40px rgba(21, 84, 232, 0.5)'
              }}
            >
              <span>ENTER SOVEREIGN COMMAND PORTAL</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        )}

      </div>

    </div>
  );
};

export default CinematicIntro;
