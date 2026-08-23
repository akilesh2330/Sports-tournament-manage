import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';

const Registrations = () => {
  const [data, setData] = useState({ pendingRegs: [], allRegs: [] });
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const res = await API.get('/registrations');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await API.put(`/registrations/${id}/status`, { action });
      fetchRegistrations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update registration status');
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading registrations...</div>;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle color="#10b981" size={28} />
          Registration Approvals (Admin)
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
          Review and approve team applications for upcoming tournaments.
        </p>
      </div>

      {/* Pending Requests Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color="#f59e0b" />
          Pending Approvals ({data.pendingRegs.length})
        </h2>

        {data.pendingRegs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {data.pendingRegs.map((reg) => (
              <div key={reg._id} className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: '700', marginBottom: '4px' }}>
                  {reg.tournament?.name || 'Tournament'} ({reg.tournament?.sport})
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '6px 0' }}>{reg.team?.teamName}</h3>
                <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '16px' }}>
                  Captain: <strong style={{ color: '#fff' }}>{reg.team?.captain}</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleAction(reg._id, 'approve')} className="btn btn-success btn-sm" style={{ flex: 1 }}>
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button onClick={() => handleAction(reg._id, 'reject')} className="btn btn-danger btn-sm" style={{ flex: 1 }}>
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
            No pending registration requests at this time.
          </div>
        )}
      </div>

      {/* All Registrations History Table */}
      <div>
        <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '16px' }}>Registration History</h2>
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#9ca3af' }}>
                <th style={{ padding: '12px 16px' }}>Team Name</th>
                <th style={{ padding: '12px 16px' }}>Captain</th>
                <th style={{ padding: '12px 16px' }}>Tournament</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {data.allRegs.map((reg) => (
                <tr key={reg._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#fff' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{reg.team?.teamName}</td>
                  <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{reg.team?.captain}</td>
                  <td style={{ padding: '12px 16px' }}>{reg.tournament?.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${reg.status.toLowerCase()}`}>{reg.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '0.8rem' }}>
                    {new Date(reg.registeredAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Registrations;
