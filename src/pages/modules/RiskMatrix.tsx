import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { Grid, ShieldAlert, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const RiskMatrix = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const [hoveredCell, setHoveredCell] = useState<{ p: number; i: number } | null>(null);

  // 5x5 Matrix cells (Probability 5 down to 1, Impact 1 up to 5)
  // Scores = P * I
  const getCellSeverity = (score: number) => {
    if (score >= 15) return { bg: 'rgba(239, 68, 68, 0.2)', border: '#EF4444', text: '#F87171', label: 'Critical' };
    if (score >= 10) return { bg: 'rgba(245, 158, 11, 0.2)', border: '#F59E0B', text: '#FCD34D', label: 'High' };
    if (score >= 5) return { bg: 'rgba(21, 84, 232, 0.22)', border: '#2E9BF8', text: '#2E9BF8', label: 'Medium' };
    return { bg: 'rgba(106, 231, 247, 0.12)', border: '#6AE7F7', text: '#6AE7F7', label: 'Low' };
  };

  const matrixCounts: Record<string, number> = {
    '5-5': 1, '5-4': 2, '4-4': 2, '4-5': 1,
    '3-4': 3, '3-3': 5, '2-4': 2, '2-3': 4,
    '1-2': 6, '1-1': 12, '2-2': 8, '3-2': 4
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(7, 17, 46, 0.92)',
        border: '1px solid rgba(46, 155, 248, 0.25)',
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(7, 17, 46, 0.9)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6AE7F7', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            <Grid size={16} /> Risk Analysis Matrix
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', color: '#F6FDFF', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
            5x5 Risk Heatmap & Probability Matrix
          </h1>
          <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.95rem' }}>
            Two-dimensional probability vs. impact distribution across all active institutional hazards.
          </p>
        </div>
      </div>

      {/* Main 5x5 Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        <div className="glass-card" style={{ 
          padding: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          background: 'rgba(7, 17, 46, 0.92)',
          border: '1px solid rgba(46, 155, 248, 0.25)',
          borderRadius: '20px'
        }}>
          
          <div style={{ width: '100%', maxWidth: '640px' }}>
            
            <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
              <div style={{ width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: 'rgba(246, 253, 255, 0.6)', transform: 'rotate(-90deg)', fontFamily: "'JetBrains Mono', monospace" }}>
                PROBABILITY
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[5, 4, 3, 2, 1].map((prob) => (
                  <div key={prob} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ width: '20px', fontSize: '0.85rem', fontWeight: 700, color: 'rgba(246, 253, 255, 0.6)', fontFamily: "'JetBrains Mono', monospace" }}>{prob}</span>
                    {[1, 2, 3, 4, 5].map((imp) => {
                      const score = prob * imp;
                      const sev = getCellSeverity(score);
                      const count = matrixCounts[`${prob}-${imp}`] || 0;
                      const isHov = hoveredCell?.p === prob && hoveredCell?.i === imp;

                      return (
                        <div
                          key={imp}
                          onMouseEnter={() => setHoveredCell({ p: prob, i: imp })}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{
                            flex: 1,
                            height: '70px',
                            borderRadius: '12px',
                            background: sev.bg,
                            border: `2px solid ${isHov ? '#F6FDFF' : sev.border}`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transform: isHov ? 'scale(1.05)' : 'scale(1)',
                            transition: 'all 0.2s',
                            boxShadow: isHov ? `0 0 16px ${sev.border}` : 'none',
                            position: 'relative'
                          }}
                        >
                          <span style={{ fontSize: '1rem', fontWeight: '900', color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>
                            {count > 0 ? `${count} Risks` : '-'}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: sev.text, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                            Score: {score}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Labels along bottom */}
            <div style={{ display: 'flex', marginLeft: '108px', gap: '8px', marginTop: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((imp) => (
                <div key={imp} style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(246, 253, 255, 0.6)', fontFamily: "'JetBrains Mono', monospace" }}>
                  Level {imp}
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', fontWeight: 800, color: 'rgba(246, 253, 255, 0.6)', letterSpacing: '1px', fontFamily: "'JetBrains Mono', monospace" }}>
              SEVERITY &bull; IMPACT LEVEL (1 TO 5)
            </div>

          </div>

        </div>

        {/* Matrix Legend & Guidance Panel */}
        <div className="neo-card" style={{ 
          padding: '1.75rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          background: 'rgba(7, 17, 46, 0.92)',
          border: '1px solid rgba(46, 155, 248, 0.25)',
          borderRadius: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F6FDFF', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
              <Info size={18} color="#6AE7F7" /> Severity Thresholds
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Critical Risk (15 - 25)', desc: 'Immediate executive intervention required. Autonomous mitigation triggered.', color: '#EF4444' },
                { label: 'High Risk (10 - 14)', desc: 'Mitigation plan assigned with 24-hour review SLA.', color: '#F59E0B' },
                { label: 'Medium Risk (5 - 9)', desc: 'Routine department monitoring and automated alert checks.', color: '#2E9BF8' },
                { label: 'Low Risk (1 - 4)', desc: 'Acceptable operational baseline tolerances.', color: '#6AE7F7' },
              ].map(tier => (
                <div key={tier.label} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(13, 35, 77, 0.55)', borderLeft: `4px solid ${tier.color}`, border: '1px solid rgba(46, 155, 248, 0.15)' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: tier.color, marginBottom: '0.25rem' }}>
                    {tier.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', lineHeight: 1.4 }}>
                    {tier.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', background: 'rgba(21, 84, 232, 0.15)', border: '1px solid rgba(106, 231, 247, 0.3)', color: '#6AE7F7', fontSize: '0.82rem', fontWeight: 600 }}>
            {currentOrg.name} has 48 total active risk vectors cataloged.
          </div>
        </div>

      </div>

    </div>
  );
};

export default RiskMatrix;
