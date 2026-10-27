import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin-dashboard';
    if (user.role === 'provider') return '/provider-dashboard';
    return '/customer-dashboard';
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-wrapper">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="logo-icon">NF</div>
          <div className="logo-text">
            <span className="logo-title">NearFix</span>
          </div>
        </Link>

        {/* Mobile toggle button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/providers"
            className={`nav-link ${location.pathname === '/providers' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Find Providers
          </Link>

          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                className={`nav-link dashboard-link ${location.pathname.includes('dashboard') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Dashboard
              </Link>

              <div className="user-menu">
                <span className="user-chip">
                  <span className="role-tag">{user.role}</span>
                  {user.full_name}
                </span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMenu}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>

      <style>{`
        .navbar-wrapper {
          background-color: #ffffff;
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, var(--primary-teal), var(--accent-blue));
          color: #ffffff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          box-shadow: var(--shadow-sm);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .logo-location {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--primary-teal);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .nav-location-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: var(--primary-teal-bg);
          border: 1px solid var(--primary-teal-light);
          color: var(--primary-teal-hover);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
        }

        .location-pin {
          font-size: 0.9rem;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-link {
          color: var(--text-body);
          font-size: 0.95rem;
          font-weight: 500;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--primary-teal);
          background-color: var(--primary-teal-bg);
        }

        .dashboard-link {
          font-weight: 600;
          color: var(--accent-blue);
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 10px;
          border-left: 1px solid var(--border-color);
        }

        .user-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .role-tag {
          font-size: 0.7rem;
          text-transform: uppercase;
          background-color: #f1f5f9;
          color: var(--text-muted);
          padding: 2px 7px;
          border-radius: var(--radius-sm);
          font-weight: 700;
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-dark);
          cursor: pointer;
          padding: 6px;
        }

        @media (max-width: 860px) {
          .nav-location-pill {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }

          .nav-menu {
            display: none;
            position: absolute;
            top: 70px;
            left: 0;
            width: 100%;
            background-color: #ffffff;
            flex-direction: column;
            padding: 20px;
            border-bottom: 1px solid var(--border-color);
            box-shadow: var(--shadow-md);
            gap: 14px;
            align-items: stretch;
          }

          .nav-menu.open {
            display: flex;
          }

          .user-menu {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--border-color);
            padding-top: 14px;
            flex-direction: column;
            align-items: stretch;
          }

          .auth-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </header>
  );
}
