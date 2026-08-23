import React, { useState } from 'react';
import { X, Trophy } from 'lucide-react';
import API from '../api/axios';

const CreateTournamentModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [sport, setSport] = useState('Football');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxTeams, setMaxTeams] = useState(8);
  const [status, setStatus] = useState('Upcoming');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await API.post('/tournaments', {
        name,
        sport,
        location,
        startDate,
        endDate,
        maxTeams,
        status
      });
      onCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tournament');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy color="#6366f1" size={22} />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Create New Tournament</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && <div style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#fca5a5', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tournament Name</label>
            <input type="text" className="form-input" placeholder="e.g. Inter-College Football League" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Sport Category</label>
              <input type="text" className="form-input" placeholder="Football, Cricket, E-Sports..." value={sport} onChange={(e) => setSport(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Location / Stadium</label>
              <input type="text" className="form-input" placeholder="Main Campus Ground" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Max Teams Allowed</label>
              <input type="number" min="2" className="form-input" value={maxTeams} onChange={(e) => setMaxTeams(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentModal;
