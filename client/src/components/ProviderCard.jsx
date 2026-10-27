import React from 'react';
import { Link } from 'react-router-dom';

export default function ProviderCard({ provider }) {
  const {
    id,
    name,
    service_category,
    locality,
    experience_years,
    description,
    availability_status,
    category_icon,
  } = provider;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="badge badge-available">● Available</span>;
      case 'Busy':
        return <span className="badge badge-busy">● Currently Busy</span>;
      case 'On Leave':
        return <span className="badge badge-leave">● On Leave</span>;
      default:
        return <span className="badge badge-available">{status}</span>;
    }
  };

  const getCategoryIcon = (category) => {
    if (category_icon) return category_icon;
    if (category?.toLowerCase().includes('electrician')) return '⚡';
    if (category?.toLowerCase().includes('plumber')) return '🔧';
    if (category?.toLowerCase().includes('ac')) return '❄️';
    return '🛠️';
  };

  return (
    <div className="card provider-card">
      <div className="provider-header">
        {/* Simple service icon instead of a person photo */}
        <div className="provider-icon-badge" title={service_category}>
          <span>{getCategoryIcon(service_category)}</span>
        </div>
        <div className="provider-title-group">
          <h3 className="provider-name">{name}</h3>
          <div className="provider-tags">
            <span className="badge badge-service">{service_category}</span>
            {getStatusBadge(availability_status)}
          </div>
        </div>
      </div>

      <div className="provider-details-list">
        <div className="provider-detail-item">
          <span className="detail-icon">📍</span>
          <span className="detail-text">{locality}</span>
        </div>
        <div className="provider-detail-item">
          <span className="detail-icon">⏱️</span>
          <span className="detail-text">{experience_years} years experience</span>
        </div>
      </div>

      <p className="provider-description">{description}</p>

      <div className="provider-card-footer">
        <span className="coverage-tag">📍 Verified Profile</span>
        <Link to={`/providers/${id}`} className="btn btn-outline-teal btn-sm">
          View Details →
        </Link>
      </div>

      <style>{`
        .provider-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .provider-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-teal);
        }

        .provider-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 14px;
        }

        .provider-icon-badge {
          width: 50px;
          height: 50px;
          min-width: 50px;
          background-color: var(--primary-teal-bg);
          border: 1px solid var(--primary-teal-light);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
        }

        .provider-title-group {
          flex: 1;
        }

        .provider-name {
          font-size: 1.18rem;
          margin-bottom: 6px;
          color: var(--text-dark);
        }

        .provider-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .provider-details-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
          padding: 10px 12px;
          background-color: #f8fafc;
          border-radius: var(--radius-sm);
        }

        .provider-detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--text-body);
        }

        .detail-icon {
          font-size: 0.95rem;
        }

        .provider-description {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 18px;
          flex-grow: 1;
        }

        .provider-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
        }

        .demo-tag {
          font-size: 0.72rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
}
