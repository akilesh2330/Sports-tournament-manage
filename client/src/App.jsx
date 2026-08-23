import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tournaments from './pages/Tournaments';
import TournamentDetails from './pages/TournamentDetails';
import Teams from './pages/Teams';
import Registrations from './pages/Registrations';
import Matches from './pages/Matches';
import Results from './pages/Results';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading session...</div>;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/tournaments" element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
              <Route path="/tournaments/:id" element={<ProtectedRoute><TournamentDetails /></ProtectedRoute>} />
              <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
              <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />

              <Route path="/registrations" element={
                <ProtectedRoute adminOnly={true}>
                  <Registrations />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
