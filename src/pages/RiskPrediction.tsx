import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, AlertTriangle } from 'lucide-react';

const riskData = [
  { time: '01:00', risk: 10, confidence: 95 },
  { time: '05:00', risk: 15, confidence: 92 },
  { time: '09:00', risk: 45, confidence: 88 },
  { time: '13:00', risk: 80, confidence: 91 },
  { time: '17:00', risk: 65, confidence: 96 },
  { time: '21:00', risk: 25, confidence: 98 },
];

const RiskPrediction = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Section */}
      <div className="neo-card" style={{ 
        position: 'relative', height: '240px', borderRadius: '24px', overflow: 'hidden',
        display: 'flex', alignItems: 'center', padding: '3rem',
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--primary-light) 100%)'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Brain size={24} />
            <span style={{ fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.875rem' }}>AI Forecast Engine</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Risk Probability Matrix
          </h1>
        </div>
      </div>

      {/* Main Chart */}
      <div className="neo-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} color="var(--warning)" /> 24-Hour Predictive Risk Curve
        </h3>
        <div style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskData}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }} />
              <Area type="monotone" dataKey="risk" stroke="var(--danger)" strokeWidth={4} fillOpacity={1} fill="url(#riskGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
};

export default RiskPrediction;
