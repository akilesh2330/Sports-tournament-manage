import React from 'react';

const StatCard = ({ icon, title, value, subtitle, gradient }) => {
  return (
    <div className="glass-panel" style={{
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        background: gradient || 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: '500' }}>{title}</div>
        <div style={{ fontSize: '1.8rem', fontWeight: '800', margin: '4px 0', color: '#fff' }}>{value}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
