import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './AppShell.css';

const AppShell = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('name') || 'Admin';

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // ignore — clear session regardless
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
      navigate('/login');
    }
  };

  const pageTitle = location.pathname.includes('/products') ? 'Products' : 'Dashboard';

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand-block">
          <div className="brand-icon">RB</div>
          <div>
            <h2>Retail Billing</h2>
            <p>Admin workspace</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📊</span>
            Dashboard
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📦</span>
            Products
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-name">{userName}</p>
            <p className="user-role">Shop owner</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-left">
            <p className="eyebrow">Operations</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="topbar-right">
            <span className="topbar-date">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </header>

        <main className="app-content">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
