import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trophy, LogIn, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@tournament.com');
      setPassword('admin123');
    } else {
      setEmail('user@tournament.com');
      setPassword('user123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)'
          }}>
            <Trophy size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '6px' }}>Welcome to Apex Arena</h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Sign in to manage tournaments and teams</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fca5a5',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '12px' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
            <LogIn size={18} />
          </button>
        </form>

        {/* Demo Quick fill options */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '10px' }}>Quick Demo Credentials:</span>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button type="button" onClick={() => handleDemoFill('admin')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
              🛡️ Admin Account
            </button>
            <button type="button" onClick={() => handleDemoFill('user')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
              👤 Player Account
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#9ca3af' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#06b6d4', fontWeight: '600' }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
