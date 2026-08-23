import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import BracketView from '../components/BracketView';
import { Trophy, Calendar, MapPin, Users, Plus, CheckCircle, Clock, Trash2, ArrowLeft } from 'lucide-react';

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [registering, setRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState('bracket'); // 'bracket' | 'teams' | 'matches'
  const [message, setMessage] = useState('');

  const fetchDetails = async () => {
    try {
      const res = await API.get(`/tournaments/${id}`);
      setData(res.data);
      if (res.data.userTeams?.length > 0) {
        setSelectedTeamId(res.data.userTeams[0]._id);
      }
    } catch (err) {
      console.error('Failed to load tournament details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleRegisterTeam = async (e) => {
    e.preventDefault();
    if (!selectedTeamId) return;
    setRegistering(true);
    setMessage('');

    try {
      await API.post(`/tournaments/${id}/register`, { teamId: selectedTeamId });
      setMessage({ type: 'success', text: 'Registration submitted successfully! Awaiting admin approval.' });
      fetchDetails();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to register team' });
    } finally {
      setRegistering(false);
    }
  };

  const handleDeleteTournament = async () => {
    if (!window.confirm('Are you sure you want to delete this tournament? All associated matches and registrations will be deleted.')) return;
    try {
      await API.delete(`/tournaments/${id}`);
      navigate('/tournaments');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete tournament');
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading tournament details...</div>;
  if (!data) return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Tournament not found.</div>;

  const { tournament, allRegistrations, approvedRegistrations, matches, userTeams } = data;

  const registeredTeamIds = allRegistrations.map((r) => r.team?._id || r.team);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
      <button onClick={() => navigate('/tournaments')} className="btn btn-secondary btn-sm" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Tournaments
      </button>

      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span className={`badge badge-${tournament.status.toLowerCase()}`}>{tournament.status}</span>
              <span style={{ color: '#06b6d4', fontWeight: '700', fontSize: '0.85rem' }}>{tournament.sport}</span>
            </div>
            <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '12px' }}>{tournament.name}</h1>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: '#9ca3af', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#06b6d4" />
                <span>{tournament.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} color="#6366f1" />
                <span>{new Date(tournament.startDate).toLocaleDateString()} — {new Date(tournament.endDate).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} color="#10b981" />
                <span>Approved Teams: {approvedRegistrations.length} / {tournament.maxTeams}</span>
              </div>
            </div>
          </div>

          {user?.role === 'admin' && (
            <button onClick={handleDeleteTournament} className="btn btn-danger">
              <Trash2 size={16} /> Delete Tournament
            </button>
          )}
        </div>
      </div>

      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          border: message.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
          color: message.type === 'success' ? '#6ee7b7' : '#fca5a5'
        }}>
          {message.text}
        </div>
      )}

      {/* Team Registration Form for Non-Admin Users */}
      {user?.role !== 'admin' && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '12px' }}>Register Your Team for This Tournament</h3>

          {userTeams.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              You don't have any created teams yet. Create a team first in the Teams tab to register!
            </p>
          ) : (
            <form onSubmit={handleRegisterTeam} style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '240px' }}
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
              >
                {userTeams.map((t) => {
                  const isReg = registeredTeamIds.includes(t._id);
                  return (
                    <option key={t._id} value={t._id} disabled={isReg}>
                      {t.teamName} ({t.sport}) {isReg ? '— Already Registered' : ''}
                    </option>
                  );
                })}
              </select>

              <button type="submit" className="btn btn-primary" disabled={registering}>
                {registering ? 'Submitting...' : 'Register Team Now'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '24px', gap: '16px' }}>
        <button
          onClick={() => setActiveTab('bracket')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'bracket' ? '3px solid #6366f1' : '3px solid transparent',
            color: activeTab === 'bracket' ? '#fff' : '#9ca3af',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          🏆 Elimination Bracket
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'teams' ? '3px solid #6366f1' : '3px solid transparent',
            color: activeTab === 'teams' ? '#fff' : '#9ca3af',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          👥 Participating Teams ({approvedRegistrations.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'bracket' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <BracketView matches={matches} teams={approvedRegistrations.map((r) => r.team)} />
        </div>
      )}

      {activeTab === 'teams' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {approvedRegistrations.length > 0 ? (
            approvedRegistrations.map((reg) => (
              <div key={reg._id} className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>{reg.team?.teamName}</h4>
                  <span className="badge badge-approved">Approved</span>
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '8px' }}>
                  Captain: <strong style={{ color: '#fff' }}>{reg.team?.captain}</strong>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', gridColumn: '1 / -1' }}>
              No approved teams registered for this tournament yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TournamentDetails;
