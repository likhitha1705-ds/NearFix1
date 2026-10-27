import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Col 1: About */}
          <div className="footer-col">
            <div className="footer-brand">
              <span className="footer-badge">NF</span>
              <span className="footer-title">NearFix</span>
            </div>
            <p className="footer-desc">
              Local service finder connecting you with trusted local professionals for essential household repairs.
            </p>
          </div>

          {/* Col 2: Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li>
                <Link to="/providers?service=Electrician">⚡ Electrician</Link>
              </li>
              <li>
                <Link to="/providers?service=Plumber">🔧 Plumber</Link>
              </li>
              <li>
                <Link to="/providers?service=AC+Repair">❄️ AC Repair</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Localities */}
          <div className="footer-col">
            <h4 className="footer-heading">Service Areas</h4>
            <ul className="footer-links">
              <li>
                <Link to="/providers?locality=Andheri+West">Andheri West</Link>
              </li>
              <li>
                <Link to="/providers?locality=Dadar">Dadar</Link>
              </li>
              <li>
                <Link to="/providers?locality=Bandra+West">Bandra West</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/providers">Find Providers</Link>
              </li>
              <li>
                <Link to="/login">Sign In</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NearFix. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: #ffffff;
          border-top: 1px solid var(--border-color);
          margin-top: 60px;
          padding: 50px 0 24px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 36px;
          margin-bottom: 40px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .footer-badge {
          background-color: var(--primary-teal);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.95rem;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }

        .footer-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-dark);
        }

        .footer-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 14px;
        }

        .footer-location-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: var(--primary-teal-bg);
          border: 1px solid var(--primary-teal-light);
          color: var(--primary-teal-hover);
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
        }

        .footer-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .footer-links {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 8px;
        }

        .footer-links a {
          color: var(--text-body);
          font-size: 0.9rem;
        }

        .footer-links a:hover {
          color: var(--primary-teal);
          padding-left: 3px;
        }

        .footer-bottom {
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .demo-notice {
          font-size: 0.78rem;
          color: var(--text-light);
          font-style: italic;
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 550px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
