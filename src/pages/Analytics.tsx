import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart } from 'lucide-react';

const analyticsData = [
  { category: 'Ops', value: 400 },
  { category: 'Security', value: 300 },
  { category: 'Finance', value: 200 },
  { category: 'HR', value: 278 },
];

const Analytics = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ padding: '1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
          <PieChart size={28} />
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>Advanced Analytics</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>Power BI-style interactive data exploration and heatmaps.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="neo-card" style={{ padding: '2rem', height: '400px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Sector Performance</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="category" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="neo-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-tertiary)' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', width: '300px', height: '200px' }}>
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} style={{ backgroundColor: `rgba(var(--primary-rgb), ${Math.random()})`, borderRadius: '2px' }} />
              ))}
            </div>
            <p style={{ marginTop: '1rem', fontWeight: '600' }}>Live Data Heatmap</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
