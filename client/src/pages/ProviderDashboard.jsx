import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user?.providerProfile || null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fallback demo profiles matching provider accounts
  const fallbackProfiles = {
    // Electricians
    'rahul.sharma@nearfix.in': {
      id: 1,
      name: 'Rahul Sharma',
      service_category: 'Electrician',
      locality: 'Andheri West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 3,
      description: 'Electrical installation, wiring checks, and minor electrical repairs.',
      availability_status: 'Available',
      demo_phone: '+91 98200 11001',
      demo_email: 'rahul.sharma@nearfix.in',
      category_icon: '⚡',
    },
    'kiran.verma@nearfix.in': {
      id: 2,
      name: 'Kiran Verma',
      service_category: 'Electrician',
      locality: 'Bandra West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 5,
      description: 'Residential and commercial wiring diagnostics, MCB replacement, and fixture setups.',
      availability_status: 'Available',
      demo_phone: '+91 98200 11002',
      demo_email: 'kiran.verma@nearfix.in',
      category_icon: '⚡',
    },
    'sanjay.rao@nearfix.in': {
      id: 3,
      name: 'Sanjay Rao',
      service_category: 'Electrician',
      locality: 'Dadar, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 4,
      description: 'Home inverter installations, circuit breaker troubleshooting, and lighting maintenance.',
      availability_status: 'Available',
      demo_phone: '+91 98200 11003',
      demo_email: 'sanjay.rao@nearfix.in',
      category_icon: '⚡',
    },

    // Plumbers
    'amit.patil@nearfix.in': {
      id: 4,
      name: 'Amit Patil',
      service_category: 'Plumber',
      locality: 'Dadar, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 4,
      description: 'Tap repairs, water leakage, and basic pipe maintenance.',
      availability_status: 'Available',
      demo_phone: '+91 98200 22001',
      demo_email: 'amit.patil@nearfix.in',
      category_icon: '🔧',
    },
    'ganesh.shinde@nearfix.in': {
      id: 5,
      name: 'Ganesh Shinde',
      service_category: 'Plumber',
      locality: 'Andheri West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 6,
      description: 'Bathroom fittings, pipeline leakage inspection, and water pressure motor maintenance.',
      availability_status: 'Available',
      demo_phone: '+91 98200 22002',
      demo_email: 'ganesh.shinde@nearfix.in',
      category_icon: '🔧',
    },
    'prashant.more@nearfix.in': {
      id: 6,
      name: 'Prashant More',
      service_category: 'Plumber',
      locality: 'Bandra West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 3,
      description: 'Kitchen sink drainage unclogging, geyser pipeline connections, and valve repairs.',
      availability_status: 'Available',
      demo_phone: '+91 98200 22003',
      demo_email: 'prashant.more@nearfix.in',
      category_icon: '🔧',
    },

    // AC Repairs
    'neha.deshmukh@nearfix.in': {
      id: 7,
      name: 'Neha Deshmukh',
      service_category: 'AC Repair',
      locality: 'Bandra West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 3,
      description: 'AC cleaning, routine servicing, and basic cooling issue checks.',
      availability_status: 'Available',
      demo_phone: '+91 98200 33001',
      demo_email: 'neha.deshmukh@nearfix.in',
      category_icon: '❄️',
    },
    'sameer.khan@nearfix.in': {
      id: 8,
      name: 'Sameer Khan',
      service_category: 'AC Repair',
      locality: 'Andheri West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 5,
      description: 'Split and window AC gas refilling, compressor diagnostics, and filter sanitization.',
      availability_status: 'Available',
      demo_phone: '+91 98200 33002',
      demo_email: 'sameer.khan@nearfix.in',
      category_icon: '❄️',
    },
    'vikram.joshi@nearfix.in': {
      id: 9,
      name: 'Vikram Joshi',
      service_category: 'AC Repair',
      locality: 'Dadar, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 4,
      description: 'Copper piping repair, PCB board troubleshooting, and seasonal preventive maintenance.',
      availability_status: 'Available',
      demo_phone: '+91 98200 33003',
      demo_email: 'vikram.joshi@nearfix.in',
      category_icon: '❄️',
    },
  };

  useEffect(() => {
    async function loadProviderData() {
      setLoading(true);
      try {
        // Load user info and provider profile
        const meRes = await api.auth.getMe();
        if (meRes.success && meRes.user && meRes.user.providerProfile) {
          setProfile(meRes.user.providerProfile);
        } else if (fallbackProfiles[user?.email]) {
          setProfile(fallbackProfiles[user?.email]);
        }

        // Load incoming service requests
        const reqRes = await api.requests.getProviderRequests();
        if (reqRes.success && reqRes.requests) {
          setIncomingRequests(reqRes.requests);
        }
      } catch (err) {
        console.warn('Using fallback provider data:', err.message);
        if (fallbackProfiles[user?.email]) {
          setProfile(fallbackProfiles[user?.email]);
        }
        setIncomingRequests([
          {
            id: 1,
            customer_name: 'Pooja Kulkarni',
            customer_phone: '+91 98200 44004',
            service_category: 'Electrician',
            preferred_date: '2026-10-18',
            locality: 'Andheri West, Mumbai',
            description: 'MCB tripping issue and inspection of living room switchboard.',
            status: 'Pending',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadProviderData();
  }, [user]);

  const handleAvailabilityChange = async (newStatus) => {
    if (!profile) return;
    setUpdatingStatus(true);
    setStatusMessage('');
    setErrorMessage('');

    try {
      const res = await api.providers.updateAvailability(profile.id, newStatus);
      if (res.success) {
        setProfile((prev) => ({ ...prev, availability_status: newStatus }));
        setStatusMessage(`Availability updated to "${newStatus}".`);
      } else {
        setErrorMessage(res.message || 'Failed to update availability.');
      }
    } catch (err) {
      // Allow local update for smooth preview
      setProfile((prev) => ({ ...prev, availability_status: newStatus }));
      setStatusMessage(`Availability set to "${newStatus}" locally.`);
    } finally {
      setUpdatingStatus(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleUpdateReqStatus = async (reqId, newStatus) => {
    try {
      await api.requests.updateStatus(reqId, newStatus);
      setIncomingRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      // Local fallback
      setIncomingRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status: newStatus } : r))
      );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="badge badge-available">● Available</span>;
      case 'Busy':
        return <span className="badge badge-busy">● Busy</span>;
      case 'On Leave':
        return <span className="badge badge-leave">● On Leave</span>;
      default:
        return <span className="badge badge-available">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading service provider dashboard...</p>
      </div>
    );
  }

  return (
    <div className="provider-dashboard-page">
      <div className="container">
        {/* Header Profile Card */}
        <div className="card provider-hero-card">
          <div className="hero-left">
            <div className="provider-big-badge">
              <span>{profile?.category_icon || '🛠️'}</span>
            </div>
            <div>
              <div className="hero-tag-row">
                <span className="badge badge-service">{profile?.service_category}</span>
                {getStatusBadge(profile?.availability_status)}
              </div>
              <h1>{profile?.name || user?.full_name}</h1>
              <p className="hero-sub">
                📍 {profile?.locality || 'Mumbai, Maharashtra'} • ⏱️ {profile?.experience_years} Years Experience
              </p>
            </div>
          </div>

          {/* Quick Availability Switcher */}
          <div className="availability-control-box">
            <span className="control-label">Update Availability Status:</span>
            <div className="status-button-group">
              <button
                type="button"
                className={`btn btn-sm ${profile?.availability_status === 'Available' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleAvailabilityChange('Available')}
                disabled={updatingStatus}
              >
                ● Available
              </button>
              <button
                type="button"
                className={`btn btn-sm ${profile?.availability_status === 'Busy' ? 'btn-accent' : 'btn-secondary'}`}
                onClick={() => handleAvailabilityChange('Busy')}
                disabled={updatingStatus}
              >
                ● Busy
              </button>
              <button
                type="button"
                className={`btn btn-sm ${profile?.availability_status === 'On Leave' ? 'btn-outline-teal' : 'btn-secondary'}`}
                onClick={() => handleAvailabilityChange('On Leave')}
                disabled={updatingStatus}
              >
                ● On Leave
              </button>
            </div>
            {statusMessage && <div className="alert alert-success mt-2">{statusMessage}</div>}
            {errorMessage && <div className="alert alert-error mt-2">{errorMessage}</div>}
          </div>
        </div>

        {/* Profile Info & Stats */}
        <div className="profile-details-grid">
          <div className="card">
            <h3>Profile Information</h3>
            <div className="info-list">
              <div className="info-row">
                <span className="info-key">Full Name:</span>
                <span className="info-val">{profile?.name}</span>
              </div>
              <div className="info-row">
                <span className="info-key">Service Category:</span>
                <span className="info-val">{profile?.service_category}</span>
              </div>
              <div className="info-row">
                <span className="info-key">Operating Locality:</span>
                <span className="info-val">{profile?.locality}</span>
              </div>
              <div className="info-row">
                <span className="info-key">Experience:</span>
                <span className="info-val">{profile?.experience_years} Years</span>
              </div>
              <div className="info-row">
                <span className="info-key">Phone Number:</span>
                <span className="info-val">{profile?.demo_phone}</span>
              </div>
              <div className="info-row">
                <span className="info-key">Email Address:</span>
                <span className="info-val">{profile?.demo_email}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Service Description</h3>
            <p style={{ color: 'var(--text-body)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {profile?.description}
            </p>
          </div>
        </div>

        {/* Incoming Service Requests */}
        <div className="incoming-section">
          <div className="section-title-row">
            <h2>Incoming Service Bookings</h2>
            <span className="count-pill">{incomingRequests.length} Total</span>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="card text-center" style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📬</div>
              <h3>No Incoming Bookings Yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                When customers in Mumbai request your services, their inquiries will appear here.
              </p>
            </div>
          ) : (
            <div className="requests-container">
              {incomingRequests.map((req) => (
                <div key={req.id} className="card request-manage-card">
                  <div className="manage-header">
                    <div>
                      <span className="badge badge-service">{req.service_category}</span>
                      <h3 style={{ margin: '6px 0 2px' }}>Customer: {req.customer_name}</h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        📞 {req.customer_phone} • 📍 {req.locality}
                      </span>
                    </div>
                    <div>
                      <span className="badge" style={{ backgroundColor: '#f1f5f9' }}>
                        Status: <strong>{req.status}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="manage-body">
                    <p style={{ margin: '8px 0', fontSize: '0.92rem' }}>
                      <strong>Repair Notes:</strong> {req.description}
                    </p>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Requested Service Date: <strong>{req.preferred_date ? req.preferred_date.slice(0, 10) : 'TBD'}</strong>
                    </div>
                  </div>

                  <div className="manage-actions">
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Update Status:</span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleUpdateReqStatus(req.id, 'Accepted')}
                      disabled={req.status === 'Accepted'}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleUpdateReqStatus(req.id, 'Completed')}
                      disabled={req.status === 'Completed'}
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleUpdateReqStatus(req.id, 'Cancelled')}
                      disabled={req.status === 'Cancelled'}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .provider-dashboard-page {
          padding: 40px 0 70px;
        }

        .provider-hero-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 30px;
          margin-bottom: 28px;
          background: linear-gradient(135deg, #ffffff 60%, var(--primary-teal-bg) 100%);
        }

        .hero-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .provider-big-badge {
          width: 70px;
          height: 70px;
          background-color: #ffffff;
          border: 1px solid var(--primary-teal-light);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
        }

        .hero-tag-row {
          display: flex;
          gap: 8px;
          margin-bottom: 6px;
        }

        .provider-hero-card h1 {
          font-size: 1.85rem;
          margin: 0 0 4px;
        }

        .hero-sub {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 0;
        }

        .availability-control-box {
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px;
          min-width: 300px;
        }

        .control-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .status-button-group {
          display: flex;
          gap: 6px;
        }

        .profile-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 36px;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 14px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.92rem;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 6px;
        }

        .info-key {
          color: var(--text-muted);
          font-weight: 500;
        }

        .info-val {
          color: var(--text-dark);
          font-weight: 600;
        }

        .disclaimer-callout {
          background-color: var(--primary-teal-bg);
          border-left: 3px solid var(--primary-teal);
          padding: 12px;
          font-size: 0.85rem;
          color: var(--text-body);
          margin-top: 20px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }

        .section-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .requests-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .request-manage-card {
          padding: 20px;
        }

        .manage-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .manage-body {
          background-color: #f8fafc;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          margin-bottom: 14px;
        }

        .manage-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mt-2 {
          margin-top: 8px;
        }

        @media (max-width: 860px) {
          .provider-hero-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .availability-control-box {
            width: 100%;
          }

          .profile-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
