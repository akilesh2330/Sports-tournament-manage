import React from 'react';
import { Trophy, Swords, CheckCircle2 } from 'lucide-react';

const BracketView = ({ matches, teams }) => {
  // Group matches by round number
  const roundsMap = {};
  matches.forEach((m) => {
    const r = m.roundNumber || 1;
    if (!roundsMap[r]) roundsMap[r] = [];
    roundsMap[r].push(m);
  });

  const roundNumbers = Object.keys(roundsMap).map(Number).sort((a, b) => a - b);

  if (matches.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
        <Swords size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
        <p style={{ fontSize: '1rem', fontWeight: '600' }}>No matches scheduled for this tournament yet.</p>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Administrators can schedule matches from the match manager.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', padding: '20px 0' }}>
      <div style={{ display: 'flex', gap: '32px', minWidth: 'max-content', paddingBottom: '16px' }}>
        {roundNumbers.map((roundNum) => (
          <div key={roundNum} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '280px' }}>
            <div style={{
              textAlign: 'center',
              padding: '8px 16px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '8px',
              fontWeight: '700',
              color: '#c7d2fe',
              fontSize: '0.9rem',
              letterSpacing: '0.05em'
            }}>
              {roundNum === 1 ? 'Quarter / Initial Round' : roundNum === 2 ? 'Semi-Finals' : roundNum === 3 ? 'Finals' : `Round ${roundNum}`}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', flex: 1 }}>
              {roundsMap[roundNum].map((match) => {
                const team1Name = match.team1?.teamName || 'TBD';
                const team2Name = match.team2?.teamName || 'TBD';
                const isCompleted = match.status === 'Completed';

                return (
                  <div key={match._id} className="glass-panel" style={{
                    padding: '16px',
                    borderLeft: isCompleted ? '4px solid #10b981' : match.status === 'Live' ? '4px solid #f59e0b' : '4px solid #6366f1'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '10px' }}>
                      <span>Venue: {match.venue}</span>
                      <span className={`badge ${isCompleted ? 'badge-completed' : match.status === 'Live' ? 'badge-live' : 'badge-upcoming'}`} style={{ fontSize: '0.65rem' }}>
                        {match.status}
                      </span>
                    </div>

                    {/* Team 1 Row */}
                    <div style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: match.winner && match.winner._id === match.team1?._id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '6px',
                      marginBottom: '6px',
                      fontWeight: match.winner && match.winner._id === match.team1?._id ? '700' : '500',
                      color: match.winner && match.winner._id === match.team1?._id ? '#6ee7b7' : '#fff'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {match.winner && match.winner._id === match.team1?._id && <Trophy size={14} color="#10b981" />}
                        <span style={{ fontSize: '0.9rem' }}>{team1Name}</span>
                      </div>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800' }}>{isCompleted ? match.score1 : '-'}</span>
                    </div>

                    {/* Team 2 Row */}
                    <div style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: match.winner && match.winner._id === match.team2?._id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '6px',
                      fontWeight: match.winner && match.winner._id === match.team2?._id ? '700' : '500',
                      color: match.winner && match.winner._id === match.team2?._id ? '#6ee7b7' : '#fff'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {match.winner && match.winner._id === match.team2?._id && <Trophy size={14} color="#10b981" />}
                        <span style={{ fontSize: '0.9rem' }}>{team2Name}</span>
                      </div>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800' }}>{isCompleted ? match.score2 : '-'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BracketView;
