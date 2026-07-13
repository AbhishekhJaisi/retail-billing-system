import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../App.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/product');
        const products = res?.data?.data ?? [];
        if (Array.isArray(products)) {
          setStats({
            total: products.length,
            inStock: products.filter(p => p.stock > 0 && p.stock > p.lowStockAlert).length,
            lowStock: products.filter(p => p.stock > 0 && p.stock <= p.lowStockAlert).length,
            outOfStock: products.filter(p => p.stock === 0).length,
          });
        }
      } catch {
        // stats remain at defaults
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const metrics = [
    { label: 'Total Products', value: stats.total, sub: 'Active inventory items', color: '#6366f1' },
    { label: 'In Stock', value: stats.inStock, sub: 'Ready to sell', color: '#10b981' },
    { label: 'Low Stock', value: stats.lowStock, sub: 'Need restocking', color: '#f59e0b' },
    { label: 'Out of Stock', value: stats.outOfStock, sub: 'Unavailable items', color: '#ef4444' },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-grid">
        <section className="hero-card">
          <div className="hero-text">
            <p className="eyebrow">Today</p>
            <h1>Welcome back, {user.name || localStorage.getItem('name') || 'Admin'}.</h1>
            <p>Your store dashboard. Review stock, manage products, and keep operations on track.</p>
          </div>
          <div className="hero-actions">
            <a className="primary-btn" href="/products">Manage Products</a>
            <a className="secondary-btn" href="/dashboard">Refresh</a>
          </div>
        </section>

        {metrics.map((m) => (
          <section className="metric-card" key={m.label} style={{ borderTop: `3px solid ${m.color}` }}>
            <p className="metric-label">{m.label}</p>
            <strong>{loadingStats ? '—' : m.value}</strong>
            <span>{m.sub}</span>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
