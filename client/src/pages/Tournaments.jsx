import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import TournamentCard from '../components/TournamentCard';
import CreateTournamentModal from '../components/CreateTournamentModal';
import { Trophy, Plus, Filter } from 'lucide-react';

const Tournaments = () => {
  const { user } = useContext(AuthContext);
  const [tournaments, setTournaments] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTournaments = async (statusFilter = '') => {
    setLoading(true);
    try {
      const url = statusFilter ? `/tournaments?status=${statusFilter}` : '/tournaments';
      const res = await API.get(url);
      setTournaments(res.data);
    } catch (err) {
      console.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments(filter);
  }, [filter]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy color="#6366f1" size={28} />
            Tournaments Catalog
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
            Explore ongoing competitions, view elimination brackets, or register your team.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Status Filter Buttons */}
          <div className="glass-panel" style={{ display: 'flex', padding: '4px', gap: '4px' }}>
            {['', 'Upcoming', 'Ongoing', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: filter === status ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  color: filter === status ? '#fff' : '#9ca3af',
                  transition: 'all 0.2s ease'
                }}
              >
                {status === '' ? 'All Events' : status}
              </button>
            ))}
          </div>

          {user?.role === 'admin' && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus size={18} />
              New Tournament
            </button>
          )}
        </div>
      </div>

      {/* Tournament Cards Grid */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading tournaments...</div>
      ) : tournaments.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {tournaments.map((t) => (
            <TournamentCard key={t._id} tournament={t} />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
          No tournaments found for the selected status.
        </div>
      )}

      {showModal && (
        <CreateTournamentModal
          onClose={() => setShowModal(false)}
          onCreated={() => fetchTournaments(filter)}
        />
      )}
    </div>
  );
};

export default Tournaments;
