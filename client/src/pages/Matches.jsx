import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import ScoreModal from '../components/ScoreModal';
import ScheduleMatchModal from '../components/ScheduleMatchModal';
import { Swords, Plus, Calendar, MapPin, Award, Video } from 'lucide-react';

const Matches = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [loading, setLoading] = useState(true);

  const [activeMatchForScore, setActiveMatchForScore] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const matchUrl = selectedTournament ? `/matches?tournament_id=${selectedTournament}` : '/matches';
      const [matchRes, tRes, teamRes] = await Promise.all([
        API.get(matchUrl),
        API.get('/tournaments'),
        API.get('/teams')
      ]);
      setMatches(matchRes.data);
      setTournaments(tRes.data);
      setTeams(teamRes.data);
    } catch (err) {
      console.error('Failed to load match data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTournament]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Swords color="#6366f1" size={28} />
            Matches & Fixtures
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
            View upcoming games, live scores, venue information, and live streams.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Tournament Selector */}
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '220px' }}
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
          >
            <option value="">All Tournaments</option>
            {tournaments.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>

          {user?.role === 'admin' && (
            <button onClick={() => setShowScheduleModal(true)} className="btn btn-primary">
              <Plus size={18} /> Schedule Match
            </button>
          )}
        </div>
      </div>

      {/* Match Cards List */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading match schedule...</div>
      ) : matches.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {matches.map((m) => {
            const isCompleted = m.status === 'Completed';

            return (
              <div key={m._id} className="glass-panel glass-card-interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: '700' }}>
                      {m.tournament?.name || 'Tournament'}
                    </span>
                    <span className={`badge ${isCompleted ? 'badge-completed' : m.status === 'Live' ? 'badge-live' : 'badge-upcoming'}`}>
                      {m.status}
                    </span>
                  </div>

                  {/* Teams vs Board */}
                  <div style={{ background: 'rgba(10, 15, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '16px', margin: '14px 0', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: m.winner && m.winner._id === m.team1?._id ? '#6ee7b7' : '#fff' }}>
                          {m.team1?.teamName || 'TBD'}
                        </div>
                        {isCompleted && <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6366f1', marginTop: '4px' }}>{m.score1}</div>}
                      </div>

                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#9ca3af', padding: '0 12px' }}>VS</div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: m.winner && m.winner._id === m.team2?._id ? '#6ee7b7' : '#fff' }}>
                          {m.team2?.teamName || 'TBD'}
                        </div>
                        {isCompleted && <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6366f1', marginTop: '4px' }}>{m.score2}</div>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#9ca3af' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={15} color="#6366f1" />
                      <span>{new Date(m.matchDate).toLocaleDateString()} at {m.matchTime} (Round {m.roundNumber})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={15} color="#06b6d4" />
                      <span>{m.venue}</span>
                    </div>
                    {m.streamUrl && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <Video size={15} color="#f43f5e" />
                        <a href={m.streamUrl} target="_blank" rel="noreferrer" style={{ color: '#f43f5e', fontWeight: '600' }}>
                          Watch Live Stream
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {user?.role === 'admin' && (
                  <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '16px' }}>
                    <button onClick={() => setActiveMatchForScore(m)} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                      <Award size={15} /> Update Score & Winner
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
          No matches found for this filter.
        </div>
      )}

      {/* Modals */}
      {activeMatchForScore && (
        <ScoreModal
          match={activeMatchForScore}
          onClose={() => setActiveMatchForScore(null)}
          onUpdate={() => fetchData()}
        />
      )}

      {showScheduleModal && (
        <ScheduleMatchModal
          tournaments={tournaments}
          teams={teams}
          onClose={() => setShowScheduleModal(false)}
          onCreated={() => fetchData()}
        />
      )}
    </div>
  );
};

export default Matches;
