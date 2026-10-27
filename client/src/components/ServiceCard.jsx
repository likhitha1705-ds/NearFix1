import React from 'react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ category }) {
  const { name, description, icon } = category;

  return (
    <div className="card service-card">
      <div className="service-icon-box">
        <span className="service-unicode-icon">{icon}</span>
      </div>
      <h3 className="service-title">{name}</h3>
      <p className="service-desc">{description}</p>
      <div className="service-footer">
        <span className="service-coverage">📍 Verified Service</span>
        <Link to={`/providers?service=${encodeURIComponent(name)}`} className="btn btn-primary btn-sm service-btn">
          Find Providers →
        </Link>
      </div>

      <style>{`
        .service-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          position: relative;
        }

        .service-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary-teal);
          box-shadow: var(--shadow-md);
        }

        .service-icon-box {
          width: 54px;
          height: 54px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--primary-teal-bg), var(--accent-blue-light));
          border: 1px solid var(--primary-teal-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .service-unicode-icon {
          font-size: 1.8rem;
        }

        .service-title {
          font-size: 1.25rem;
          margin-bottom: 8px;
          color: var(--text-dark);
        }

        .service-desc {
          font-size: 0.92rem;
          color: var(--text-muted);
          flex-grow: 1;
          margin-bottom: 20px;
        }

        .service-footer {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
        }

        .service-coverage {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary-teal);
        }

        .service-btn {
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
