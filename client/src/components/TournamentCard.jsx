import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Users, ArrowRight } from 'lucide-react';

const TournamentCard = ({ tournament }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Ongoing': return 'badge-ongoing';
      case 'Completed': return 'badge-completed';
      default: return 'badge-upcoming';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="glass-panel glass-card-interactive" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      gap: '16px'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span className={`badge ${getBadgeClass(tournament.status)}`}>
            {tournament.status}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '600', background: 'rgba(255, 255, 255, 0.05)', padding: '3px 8px', borderRadius: '6px' }}>
            {tournament.sport}
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '10px' }}>{tournament.name}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#9ca3af' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={15} color="#06b6d4" />
            <span>{tournament.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={15} color="#6366f1" />
            <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={15} color="#10b981" />
            <span>Max Teams: {tournament.maxTeams}</span>
          </div>
        </div>
      </div>

      <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <Link to={`/tournaments/${tournament._id}`} className="btn btn-secondary" style={{ width: '100%' }}>
          View Details & Bracket
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

export default TournamentCard;
