import { Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import AppShell from './components/AppShell';
import './App.css';

// Redirect to login if no token is present
const Protected = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const isAuthed = Boolean(localStorage.getItem('token'));

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthed ? '/dashboard' : '/login'} replace />} />
      {/* Auth pages redirect to dashboard when already logged in */}
      <Route path="/register" element={isAuthed ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/login" element={isAuthed ? <Navigate to="/dashboard" replace /> : <Login />} />

      <Route
        path="/dashboard"
        element={
          <Protected>
            <AppShell>
              <Dashboard />
            </AppShell>
          </Protected>
        }
      />

      <Route
        path="/products"
        element={
          <Protected>
            <AppShell>
              <Products />
            </AppShell>
          </Protected>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
