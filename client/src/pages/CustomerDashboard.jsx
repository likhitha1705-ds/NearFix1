import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await api.requests.getCustomerRequests();
        if (res.success && res.requests) {
          setRequests(res.requests);
        }
      } catch (err) {
        console.warn('Error loading customer requests:', err.message);
        // Fallback demo requests
        setRequests([
          {
            id: 1,
            service_category: 'Electrician',
            provider_name: 'Rahul Sharma',
            provider_phone: '+91 98200 11001 (Demo)',
            preferred_date: '2026-10-18',
            locality: user?.locality || 'Andheri West, Mumbai',
            description: 'MCB tripping issue and inspection of living room switchboard.',
            status: 'Pending',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return <span className="badge badge-available">● Accepted</span>;
      case 'Completed':
        return <span className="badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>✓ Completed</span>;
      case 'Cancelled':
        return <span className="badge badge-leave">✕ Cancelled</span>;
      default:
        return <span className="badge badge-busy">⏳ Pending</span>;
    }
  };

  return (
    <div className="customer-dashboard-page">
      <div className="container">
        {/* Welcome Banner */}
        <div className="welcome-banner card">
          <div className="welcome-info">
            <span className="badge badge-city">Customer Account</span>
            <h1>Welcome back, {user?.full_name}!</h1>
            <p className="welcome-sub">
              📍 Address: <strong>{user?.locality || 'Not specified'}</strong> • Email: {user?.email}
            </p>
          </div>
          <div className="welcome-actions">
            <Link to="/" className="btn btn-secondary">
              🔍 Search Services
            </Link>
            <Link to="/providers" className="btn btn-primary">
              ⚡ Find Providers
            </Link>
          </div>
        </div>

        {/* Recent Service Requests / Activity */}
        <div className="activity-section">
          <div className="activity-header">
            <h2>Your Service Requests</h2>
            <span className="count-pill">{requests.length} Total</span>
          </div>

          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p>Loading your activity...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : requests.length === 0 ? (
            <div className="card empty-activity-card">
              <div className="empty-icon">📋</div>
              <h3>No Service Requests Yet</h3>
              <p>You haven't requested any household repairs yet.</p>
              <Link to="/providers" className="btn btn-primary" style={{ marginTop: '10px' }}>
                Browse Local Providers
              </Link>
            </div>
          ) : (
            <div className="requests-list">
              {requests.map((req) => (
                <div key={req.id} className="card request-item-card">
                  <div className="req-header-row">
                    <div className="req-title-group">
                      <span className="badge badge-service">{req.service_category}</span>
                      <h3 className="req-provider-name">Assigned Provider: {req.provider_name}</h3>
                    </div>
                    <div>{getStatusBadge(req.status)}</div>
                  </div>

                  <div className="req-meta-row">
                    <span>📅 Scheduled Date: <strong>{req.preferred_date ? req.preferred_date.slice(0, 10) : 'TBD'}</strong></span>
                    <span>📍 Service Area: <strong>{req.locality}</strong></span>
                    {req.provider_phone && (
                      <span>📞 Provider Contact: <strong>{req.provider_phone}</strong></span>
                    )}
                  </div>

                  <div className="req-description-box">
                    <strong>Issue Note:</strong> {req.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .customer-dashboard-page {
          padding: 40px 0 70px;
        }

        .welcome-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 30px;
          margin-bottom: 36px;
          background: linear-gradient(135deg, #ffffff 60%, var(--primary-teal-bg) 100%);
        }

        .welcome-info h1 {
          font-size: 1.85rem;
          margin: 8px 0;
        }

        .welcome-sub {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 0;
        }

        .welcome-actions {
          display: flex;
          gap: 12px;
        }

        .activity-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .count-pill {
          background-color: var(--primary-teal-bg);
          color: var(--primary-teal);
          font-weight: 700;
          font-size: 0.85rem;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--primary-teal-light);
        }

        .empty-activity-card {
          text-align: center;
          padding: 50px 20px;
        }

        .empty-icon {
          font-size: 2.2rem;
          margin-bottom: 10px;
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .request-item-card {
          padding: 20px 24px;
        }

        .req-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .req-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .req-provider-name {
          font-size: 1.15rem;
          margin: 0;
          color: var(--text-dark);
        }

        .req-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          font-size: 0.88rem;
          color: var(--text-body);
          margin-bottom: 12px;
          background-color: #f8fafc;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
        }

        .req-description-box {
          font-size: 0.92rem;
          color: var(--text-body);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .welcome-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .welcome-actions {
            width: 100%;
            flex-direction: column;
          }

          .req-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
