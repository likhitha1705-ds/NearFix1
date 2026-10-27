import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState('customer'); // 'customer' or 'provider'

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    locality: '',
    service_category: 'Electrician',
    experience_years: '3',
    description: '',
    password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { full_name, email, phone, locality, password, confirm_password, service_category, experience_years, description } = formData;

    if (!full_name.trim() || !email.trim() || !phone.trim() || !locality.trim() || !password || !confirm_password) {
      setError('Please fill in all required fields, including your address/locality.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirm_password) {
      setError('Passwords do not match. Please re-enter carefully.');
      return;
    }

    if (role === 'provider' && !description.trim()) {
      setError('Please enter a brief description of your repair services.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.register({
        role,
        full_name: full_name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        locality: locality.trim(),
        service_category: role === 'provider' ? service_category : undefined,
        experience_years: role === 'provider' ? experience_years : undefined,
        description: role === 'provider' ? description.trim() : undefined,
        password,
        confirm_password,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        if (res.user.role === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/customer-dashboard');
        }
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="auth-card card">
          <div className="auth-header">
            <div className="auth-icon">{role === 'provider' ? '🛠️' : '📝'}</div>
            <h2>{role === 'provider' ? 'Service Provider Registration' : 'Customer Registration'}</h2>
            <p className="auth-subtitle">
              {role === 'provider'
                ? 'Join NearFix to offer your professional repair services.'
                : 'Create an account to book household repair services.'}
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="role-switcher">
            <button
              type="button"
              className={`switcher-tab ${role === 'customer' ? 'active' : ''}`}
              onClick={() => {
                setRole('customer');
                setError('');
              }}
            >
              👤 Customer Account
            </button>
            <button
              type="button"
              className={`switcher-tab ${role === 'provider' ? 'active' : ''}`}
              onClick={() => {
                setRole('provider');
                setError('');
              }}
            >
              ⚡ Service Provider
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">
                {role === 'provider' ? 'Provider / Business Name' : 'Full Name'}
              </label>
              <input
                id="reg-name"
                name="full_name"
                type="text"
                className="form-input"
                placeholder={role === 'provider' ? 'e.g. Ramesh Kumar' : 'e.g. Rohan Mehta'}
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">
                Email Address
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="reg-phone" className="form-label">
                Phone Number
              </label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                className="form-input"
                placeholder="+91 98200 00000"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* If Service Provider: Service Category */}
            {role === 'provider' && (
              <div className="form-group">
                <label htmlFor="reg-service" className="form-label">
                  Service Category
                </label>
                <select
                  id="reg-service"
                  name="service_category"
                  className="form-select"
                  value={formData.service_category}
                  onChange={handleChange}
                  required
                >
                  <option value="Electrician">Electrician (Electrical repairs)</option>
                  <option value="Plumber">Plumber (Water & pipes)</option>
                  <option value="AC Repair">AC Repair (Cooling & servicing)</option>
                </select>
              </div>
            )}

            {/* Address / Locality - Free text input, no options */}
            <div className="form-group">
              <label htmlFor="reg-locality" className="form-label">
                {role === 'provider' ? 'Primary Service Area / Address' : 'Address / Locality'}
              </label>
              <input
                id="reg-locality"
                name="locality"
                type="text"
                className="form-input"
                placeholder={role === 'provider' ? 'Enter any service area, locality, or address' : 'Enter your address, street, locality, or city'}
                value={formData.locality}
                onChange={handleChange}
                required
              />
            </div>

            {/* If Service Provider: Experience & Description */}
            {role === 'provider' && (
              <>
                <div className="form-group">
                  <label htmlFor="reg-experience" className="form-label">
                    Years of Experience
                  </label>
                  <input
                    id="reg-experience"
                    name="experience_years"
                    type="number"
                    min="1"
                    max="40"
                    className="form-input"
                    placeholder="e.g. 5"
                    value={formData.experience_years}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-desc" className="form-label">
                    Professional Description / Specialization
                  </label>
                  <textarea
                    id="reg-desc"
                    name="description"
                    className="form-textarea"
                    placeholder="Describe your repair experience, tools, and typical household repair jobs..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </>
            )}

            {/* Password */}
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">
                Password
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="reg-confirm" className="form-label">
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                name="confirm_password"
                type="password"
                className="form-input"
                placeholder="Re-enter password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading
                ? 'Creating Account...'
                : role === 'provider'
                ? 'Register as Service Provider'
                : 'Register Customer Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign In to NearFix
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .register-page {
          padding: 40px 0 80px;
        }

        .auth-card {
          max-width: 520px;
          margin: 0 auto;
          padding: 34px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 20px;
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

        .role-switcher {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          background-color: #f1f5f9;
          padding: 4px;
          border-radius: var(--radius-md);
        }

        .switcher-tab {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }

        .switcher-tab.active {
          background-color: #ffffff;
          color: var(--primary-teal);
          box-shadow: var(--shadow-sm);
        }

        .auth-form {
          margin-bottom: 20px;
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
