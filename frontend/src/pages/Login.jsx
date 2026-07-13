import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './Register.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(localStorage.getItem('rememberedEmail')));
  const [formData, setFormData] = useState({
    email: localStorage.getItem('rememberedEmail') || '',
    password: localStorage.getItem('rememberedPassword') || '',
  });

  const handleChange = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/login', formData);
      const data = res.data;

      if (!data?.success) {
        setError(data?.message || 'Invalid credentials');
        return;
      }

      const result = data?.data ?? data;
      const user = result?.admin ?? result?.user ?? null;
      const token = result?.token ?? null;

      if (!user || !token) {
        setError('Login response incomplete. Please try again.');
        return;
      }

      // Token is stored in localStorage — user stays logged in until they sign out
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', String(user.id ?? ''));
      localStorage.setItem('name', user.name ?? '');
      localStorage.setItem('role', user.role ?? '');

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberedPassword', formData.password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-hero">
          <p className="auth-eyebrow">Retail Billing System</p>
          <h1 className="auth-heading">Manage your store from one place.</h1>
          <p className="auth-subtext">Inventory, stock alerts, and product management — clean and fast.</p>
          <div className="auth-highlights">
            <span>📦 Live inventory updates</span>
            <span>⚡ Quick product management</span>
            <span>🔒 Secure admin access</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <p className="auth-eyebrow">Welcome back</p>
          <h2 className="auth-heading">Sign in to your account</h2>
          <p className="auth-subtext">Access your billing and inventory dashboard.</p>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="field-group">
              <label htmlFor="email">
                Email address <span className="required-mark">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="field-group">
              <label htmlFor="password">
                Password <span className="required-mark">*</span>
              </label>
              <div className="input-with-icon">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <label className="remember-row">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
