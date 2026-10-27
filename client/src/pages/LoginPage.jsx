import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectAfterLogin = (userRole) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    if (userRole === 'admin') navigate('/admin-dashboard');
    else if (userRole === 'provider') navigate('/provider-dashboard');
    else navigate('/customer-dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !role) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.login({
        email: email.trim(),
        password,
        role,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        redirectAfterLogin(res.user.role);
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'Unable to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper shortcuts for testing demo credentials
  const fillDemo = (demoRole) => {
    setError('');
    if (demoRole === 'Customer') {
      setEmail('customer@demo.in');
      setPassword('Customer@123');
      setRole('Customer');
    } else if (demoRole === 'Service Provider') {
      setEmail('rahul.sharma@demo.nearfix.in');
      setPassword('Provider@123');
      setRole('Service Provider');
    } else if (demoRole === 'Admin') {
      setEmail('admin@nearfix.in');
      setPassword('Admin@123');
      setRole('Admin');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="auth-card card">
          <div className="auth-header">
            <div className="auth-icon">🔐</div>
            <h2>Sign In to NearFix</h2>
            <p className="auth-subtitle">Select your role and enter your account credentials.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role Selection */}
            <div className="form-group">
              <label htmlFor="login-role" className="form-label">
                Select Your Role
              </label>
              <select
                id="login-role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="Customer">Customer</option>
                <option value="Service Provider">Service Provider</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Authenticating...' : `Log In as ${role}`}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              New customer?{' '}
              <Link to="/register" className="auth-link">
                Create a Customer Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          padding: 60px 0 80px;
        }

        .auth-card {
          max-width: 480px;
          margin: 0 auto;
          padding: 36px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 26px;
        }

        .auth-icon {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }

        .auth-header h2 {
          font-size: 1.6rem;
          margin-bottom: 6px;
        }

        .auth-subtitle {
          font-size: 0.92rem;
          color: var(--text-muted);
          margin-bottom: 0;
        }

        .auth-form {
          margin-bottom: 24px;
        }

        .demo-credentials-box {
          background-color: var(--primary-teal-bg);
          border: 1px dashed var(--primary-teal);
          border-radius: var(--radius-md);
          padding: 14px;
          margin-bottom: 20px;
          text-align: center;
        }

        .demo-hint-title {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-teal-hover);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .demo-buttons-row {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .auth-footer {
          text-align: center;
          padding-top: 18px;
          border-top: 1px solid var(--border-color);
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .auth-link {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
