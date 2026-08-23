import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Award, Trophy } from 'lucide-react';

const Results = () => {
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await API.get('/matches?status=Completed');
        setCompletedMatches(res.data);
      } catch (err) {
        console.error('Failed to load completed match results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading match results...</div>;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award color="#10b981" size={28} />
          Completed Match Hall of Fame
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
          Archive of finalized match outcomes, scores, and declared tournament winners.
        </p>
      </div>

      {completedMatches.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {completedMatches.map((m) => (
            <div key={m._id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: '700', marginBottom: '8px' }}>
                {m.tournament?.name} ({m.tournament?.sport})
              </div>

              <div style={{ background: 'rgba(10, 15, 26, 0.7)', borderRadius: '10px', padding: '16px', margin: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: m.winner && m.winner._id === m.team1?._id ? '#6ee7b7' : '#fff', fontWeight: m.winner && m.winner._id === m.team1?._id ? '800' : '500' }}>
                    {m.team1?.teamName}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{m.score1}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: m.winner && m.winner._id === m.team2?._id ? '#6ee7b7' : '#fff', fontWeight: m.winner && m.winner._id === m.team2?._id ? '800' : '500' }}>
                    {m.team2?.teamName}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{m.score2}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '700', fontSize: '0.9rem', marginTop: '12px' }}>
                <Trophy size={16} />
                Winner: {m.winner ? m.winner.teamName : 'Draw / Tied'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
          No completed match results recorded yet.
        </div>
      )}
    </div>
  );
};

export default Results;
