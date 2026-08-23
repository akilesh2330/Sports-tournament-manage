import React, { useState } from 'react';
import { X, Users } from 'lucide-react';
import API from '../api/axios';

const CreateTeamModal = ({ onClose, onCreated }) => {
  const [teamName, setTeamName] = useState('');
  const [captain, setCaptain] = useState('');
  const [sport, setSport] = useState('Football');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await API.post('/teams', {
        teamName,
        captain,
        sport
      });
      onCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users color="#10b981" size={22} />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Register New Team</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && <div style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#fca5a5', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Team Name</label>
            <input type="text" className="form-input" placeholder="e.g. Thunder Strikers" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Captain Name</label>
            <input type="text" className="form-input" placeholder="e.g. Alex Johnson" value={captain} onChange={(e) => setCaptain(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Sport Category</label>
            <input type="text" className="form-input" placeholder="e.g. Football, Cricket, Basketball" value={sport} onChange={(e) => setSport(e.target.value)} required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registering...' : 'Register Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
