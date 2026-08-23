import React, { useState } from 'react';
import { X, Swords } from 'lucide-react';
import API from '../api/axios';

const ScheduleMatchModal = ({ tournaments, teams, onClose, onCreated }) => {
  const [tournamentId, setTournamentId] = useState(tournaments[0]?._id || '');
  const [team1Id, setTeam1Id] = useState(teams[0]?._id || '');
  const [team2Id, setTeam2Id] = useState(teams[1]?._id || teams[0]?._id || '');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('15:00');
  const [venue, setVenue] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [roundNumber, setRoundNumber] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (team1Id === team2Id) {
      setError('Team 1 and Team 2 must be different teams');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await API.post('/matches', {
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        match_date: matchDate,
        match_time: matchTime,
        venue,
        stream_url: streamUrl,
        round_number: roundNumber
      });
      onCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule match');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Swords color="#06b6d4" size={22} />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Schedule New Match</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && <div style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#fca5a5', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Tournament</label>
            <select className="form-select" value={tournamentId} onChange={(e) => setTournamentId(e.target.value)} required>
              {tournaments.map((t) => (
                <option key={t._id} value={t._id}>{t.name} ({t.sport})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Team 1</label>
              <select className="form-select" value={team1Id} onChange={(e) => setTeam1Id(e.target.value)} required>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>{t.teamName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Team 2</label>
              <select className="form-select" value={team2Id} onChange={(e) => setTeam2Id(e.target.value)} required>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>{t.teamName}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Match Date</label>
              <input type="date" className="form-input" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Match Time</label>
              <input type="time" className="form-input" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Venue / Court Location</label>
            <input type="text" className="form-input" placeholder="e.g. Stadium Court A" value={venue} onChange={(e) => setVenue(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Stream URL (Optional)</label>
              <input type="url" className="form-input" placeholder="https://youtube.com/..." value={streamUrl} onChange={(e) => setStreamUrl(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Round #</label>
              <input type="number" min="1" className="form-input" value={roundNumber} onChange={(e) => setRoundNumber(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Schedule Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMatchModal;
