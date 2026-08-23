import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import TournamentCard from '../components/TournamentCard';
import { Trophy, Users, Calendar, Award, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import CreateTournamentModal from '../components/CreateTournamentModal';
import CreateTeamModal from '../components/CreateTeamModal';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await API.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading dashboard metrics...</div>;
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.08))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>👋</span>
            <h1 style={{ fontSize: '1.8rem', color: '#fff' }}>Welcome back, {user?.name}!</h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
            {user?.role === 'admin'
              ? 'Administrator Overview — Manage tournaments, schedule fixtures & record match outcomes.'
              : 'Player Portal — Create teams, register for tournaments & track match schedules.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {user?.role === 'admin' ? (
            <button onClick={() => setShowTournamentModal(true)} className="btn btn-primary">
              <Plus size={18} />
              Create Tournament
            </button>
          ) : (
            <button onClick={() => setShowTeamModal(true)} className="btn btn-primary">
              <Plus size={18} />
              Register Team
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <StatCard
          icon={<Trophy size={26} color="#6366f1" />}
          title="Total Tournaments"
          value={stats?.totalTournaments || 0}
          subtitle="Active & completed events"
          gradient="linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(99, 102, 241, 0.05))"
        />
        <StatCard
          icon={<Users size={26} color="#06b6d4" />}
          title="Registered Teams"
          value={stats?.totalTeams || 0}
          subtitle="Across all sport categories"
          gradient="linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(6, 182, 212, 0.05))"
        />
        <StatCard
          icon={<Calendar size={26} color="#f59e0b" />}
          title="Upcoming / Live Matches"
          value={stats?.upcomingMatchesCount || 0}
          subtitle="Fixtures awaiting completion"
          gradient="linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.05))"
        />
        <StatCard
          icon={<Award size={26} color="#10b981" />}
          title="Matches Completed"
          value={stats?.completedMatchesCount || 0}
          subtitle="Results recorded"
          gradient="linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0.05))"
        />
      </div>

      {/* Grid Layout for Recent Tournaments & Upcoming Matches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
        {/* Recent Tournaments Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>Recent Tournaments</h2>
            <Link to="/tournaments" style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats?.recentTournaments?.length > 0 ? (
              stats.recentTournaments.map((t) => (
                <TournamentCard key={t._id} tournament={t} />
              ))
            ) : (
              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No tournaments created yet.</div>
            )}
          </div>
        </div>

        {/* Upcoming Fixtures Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>Upcoming Fixtures</h2>
            <Link to="/matches" style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Full Schedule <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats?.upcomingMatches?.length > 0 ? (
              stats.upcomingMatches.map((m) => (
                <div key={m._id} className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '8px' }}>
                    <span>{m.tournament?.name || 'Tournament'}</span>
                    <span className="badge badge-upcoming">{m.status}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>{m.team1?.teamName || 'TBD'}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6366f1', background: 'rgba(99, 102, 241, 0.15)', padding: '4px 10px', borderRadius: '12px' }}>VS</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>{m.team2?.teamName || 'TBD'}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
                    <span>📅 {new Date(m.matchDate).toLocaleDateString()} at {m.matchTime}</span>
                    <span>📍 {m.venue}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No upcoming matches scheduled.</div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTournamentModal && (
        <CreateTournamentModal
          onClose={() => setShowTournamentModal(false)}
          onCreated={() => fetchStats()}
        />
      )}
      {showTeamModal && (
        <CreateTeamModal
          onClose={() => setShowTeamModal(false)}
          onCreated={() => fetchStats()}
        />
      )}
    </div>
  );
};

export default Dashboard;
