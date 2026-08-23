import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trophy, LayoutDashboard, Flag, Users, CheckCircle, Swords, Award, LogOut, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '14px 28px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Trophy size={22} color="#fff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(90deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Apex Arena
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NavLink to="/dashboard" icon={<LayoutDashboard size={17} />} label="Dashboard" active={isActive('/dashboard')} />
          <NavLink to="/tournaments" icon={<Trophy size={17} />} label="Tournaments" active={isActive('/tournaments')} />
          <NavLink to="/teams" icon={<Users size={17} />} label="Teams" active={isActive('/teams')} />
          <NavLink to="/matches" icon={<Swords size={17} />} label="Matches" active={isActive('/matches')} />
          <NavLink to="/results" icon={<Award size={17} />} label="Results" active={isActive('/results')} />
          {user.role === 'admin' && (
            <NavLink to="/registrations" icon={<CheckCircle size={17} />} label="Approvals" active={isActive('/registrations')} />
          )}
        </div>

        {/* User Info & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.9rem',
              color: '#fff'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.name}</span>
              <span style={{
                fontSize: '0.7rem',
                color: user.role === 'admin' ? '#fde047' : '#9ca3af',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {user.role === 'admin' ? '🛡️ Admin' : 'Player'}
              </span>
            </div>
          </div>

          <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label, active }) => (
  <Link to={to} style={{
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: active ? '#fff' : '#9ca3af',
    background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
    border: active ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
    transition: 'all 0.2s ease'
  }}>
    {icon}
    {label}
  </Link>
);

export default Navbar;
