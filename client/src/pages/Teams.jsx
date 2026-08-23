import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import CreateTeamModal from '../components/CreateTeamModal';
import { Users, Plus, Shield, Trash2, Trophy } from 'lucide-react';

const Teams = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await API.get('/teams');
      setTeams(res.data);
    } catch (err) {
      console.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleDelete = async (id, teamName) => {
    if (!window.confirm(`Are you sure you want to delete "${teamName}"?`)) return;
    try {
      await API.delete(`/teams/${id}`);
      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete team');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users color="#06b6d4" size={28} />
            {user?.role === 'admin' ? 'All Registered Teams' : 'My Teams'}
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
            {user?.role === 'admin'
              ? 'Overview of all sports teams across the system.'
              : 'Manage teams you captain and enter them into official tournaments.'}
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> Create New Team
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading teams...</div>
      ) : teams.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {teams.map((t) => (
            <div key={t._id} className="glass-panel glass-card-interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: '700', background: 'rgba(6, 182, 212, 0.15)', padding: '4px 10px', borderRadius: '6px' }}>
                    {t.sport}
                  </span>
                  <button onClick={() => handleDelete(t._id, t.teamName)} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }} title="Delete Team">
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>{t.teamName}</h3>
                <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  Captain: <strong style={{ color: '#fff' }}>{t.captain}</strong>
                </div>

                {user?.role === 'admin' && t.user && (
                  <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '6px' }}>
                    Owner: {t.user.name} ({t.user.email})
                  </div>
                )}
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '16px', fontSize: '0.75rem', color: '#6b7280' }}>
                Registered on {new Date(t.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
          No teams registered yet. Click "Create New Team" to get started!
        </div>
      )}

      {showModal && (
        <CreateTeamModal
          onClose={() => setShowModal(false)}
          onCreated={() => fetchTeams()}
        />
      )}
    </div>
  );
};

export default Teams;
