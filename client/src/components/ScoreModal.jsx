import React, { useState } from 'react';
import { X, Award } from 'lucide-react';
import API from '../api/axios';

const ScoreModal = ({ match, onClose, onUpdate }) => {
  const [score1, setScore1] = useState(match.score1 || 0);
  const [score2, setScore2] = useState(match.score2 || 0);
  const [status, setStatus] = useState(match.status || 'Completed');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await API.put(`/matches/${match._id}/score`, {
        score1,
        score2,
        status
      });
      onUpdate(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update match score');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award color="#6366f1" size={22} />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Record Match Score</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && <div style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#fca5a5', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label>{match.team1?.teamName || 'Team 1'} Score</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{match.team2?.teamName || 'Team 2'} Score</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={score2}
                onChange={(e) => setScore2(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Match Status</label>
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Match Results'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoreModal;
