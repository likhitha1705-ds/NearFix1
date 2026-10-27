import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Fallback demo providers matching IDs 1-9
const DEMO_PROVIDER_FALLBACKS = {
  '1': {
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
  '2': {
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
  '3': {
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
  '4': {
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
  '5': {
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
  '6': {
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
  '7': {
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
  '8': {
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
  '9': {
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

export default function ProviderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking / Service request form state
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [description, setDescription] = useState('');
  const [customerLocality, setCustomerLocality] = useState(user?.locality || 'Andheri West, Mumbai');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    async function loadProvider() {
      setLoading(true);
      setError('');
      try {
        const res = await api.providers.getById(id);
        if (res.success && res.provider) {
          if (String(res.provider.id) === String(id)) {
            setProvider(res.provider);
          } else if (DEMO_PROVIDER_FALLBACKS[id]) {
            console.warn(`Provider id mismatch: requested ${id}, received ${res.provider.id}. Using matched provider.`);
            setProvider(DEMO_PROVIDER_FALLBACKS[id]);
          } else {
            setProvider(res.provider);
          }
        } else if (DEMO_PROVIDER_FALLBACKS[id]) {
          setProvider(DEMO_PROVIDER_FALLBACKS[id]);
        } else {
          setError('Provider not found.');
        }
      } catch (err) {
        console.warn('Error fetching provider by ID:', err.message);
        if (DEMO_PROVIDER_FALLBACKS[id]) {
          setProvider(DEMO_PROVIDER_FALLBACKS[id]);
        } else {
          setError('Provider not found.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadProvider();
  }, [id]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!preferredDate || !description.trim()) {
      setRequestError('Please select a preferred service date and describe your repair issue.');
      return;
    }

    setSubmittingRequest(true);
    setRequestError('');
    setRequestSuccess('');

    try {
      const res = await api.requests.create({
        provider_id: provider.id,
        service_category: provider.service_category,
        preferred_date: preferredDate,
        locality: customerLocality,
        description: description.trim(),
      });

      if (res.success) {
        setRequestSuccess('Service request submitted successfully! View your customer dashboard for tracking.');
        setDescription('');
        setPreferredDate('');
        setTimeout(() => {
          navigate('/customer-dashboard');
        }, 1800);
      } else {
        setRequestError(res.message || 'Failed to submit request.');
      }
    } catch (err) {
      setRequestError(err.message || 'Server error submitting service request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="badge badge-available">● Available for Work</span>;
      case 'Busy':
        return <span className="badge badge-busy">● Currently Busy</span>;
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
        <p>Loading provider profile...</p>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2>Profile Not Found</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            The requested service provider profile could not be located.
          </p>
          <Link to="/providers" className="btn btn-primary" style={{ marginTop: '16px' }}>
            ← Back to Providers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-detail-page">
      <div className="container">
        {/* Navigation back */}
        <div className="breadcrumb-nav">
          <Link to="/providers" className="back-link">
            ← Back to Providers
          </Link>
        </div>

        <div className="profile-layout">
          {/* Main Profile Info Card */}
          <div className="card profile-main-card">
            <div className="profile-hero-row">
              {/* Simple service icon instead of photo */}
              <div className="profile-icon-large">
                <span>{provider.category_icon || '🛠️'}</span>
              </div>
              <div className="profile-title-area">
                <div className="profile-tag-row">
                  <span className="badge badge-service">{provider.service_category}</span>
                  {getStatusBadge(provider.availability_status)}
                </div>
                <h1 className="profile-name">{provider.name}</h1>
                <p className="profile-city-lead">📍 {provider.locality}</p>
              </div>
            </div>

            <hr className="divider" />

            <div className="profile-section">
              <h3>Professional Summary</h3>
              <p className="profile-bio">{provider.description}</p>
            </div>

            <div className="profile-section">
              <h3>Service Overview</h3>
              <div className="meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Experience</span>
                  <span className="meta-value">{provider.experience_years} Years in Mumbai</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Primary Service</span>
                  <span className="meta-value">{provider.service_category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Coverage Locality</span>
                  <span className="meta-value">{provider.locality}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Current Status</span>
                  <span className="meta-value">{provider.availability_status}</span>
                </div>
              </div>
            </div>

            <div className="profile-section contact-section">
              <h3>Contact Information</h3>
              <div className="contact-box">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div>
                    <strong className="contact-label">Phone Number:</strong>
                    <div className="contact-val">{provider.demo_phone}</div>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <strong className="contact-label">Email Address:</strong>
                    <div className="contact-val">{provider.demo_email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Booking / Request Box */}
          <div className="profile-sidebar">
            <div className="card booking-action-card">
              <h3>Request Service</h3>
              <p className="booking-desc">
                Need household repairs? Submit a service request to <strong>{provider.name}</strong> directly.
              </p>

              {requestSuccess && <div className="alert alert-success">{requestSuccess}</div>}
              {requestError && <div className="alert alert-error">{requestError}</div>}

              {user && user.role === 'customer' ? (
                <form onSubmit={handleRequestSubmit} className="booking-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="preferred-date">
                      Preferred Date
                    </label>
                    <input
                      id="preferred-date"
                      type="date"
                      className="form-input"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="customer-loc">
                      Your Service Address / Locality
                    </label>
                    <input
                      id="customer-loc"
                      type="text"
                      className="form-input"
                      value={customerLocality}
                      onChange={(e) => setCustomerLocality(e.target.value)}
                      placeholder="Enter your address, street, or locality"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="problem-desc">
                      Repair Issue Details
                    </label>
                    <textarea
                      id="problem-desc"
                      className="form-textarea"
                      placeholder="Briefly describe what needs inspection or repair..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={submittingRequest || provider.availability_status === 'On Leave'}
                  >
                    {submittingRequest ? 'Submitting...' : 'Submit Service Request'}
                  </button>

                  {provider.availability_status === 'On Leave' && (
                    <p className="form-helper" style={{ color: '#991b1b', marginTop: '8px' }}>
                      Provider is currently on leave. Requests may experience delays.
                    </p>
                  )}
                </form>
              ) : user ? (
                <div className="customer-required-box">
                  <p>You are currently logged in as a <strong>{user.role}</strong>.</p>
                  <p className="form-helper">
                    To book services, please register or log in as a <strong>Customer</strong>.
                  </p>
                </div>
              ) : (
                <div className="login-to-book-box">
                  <p>Please log in with a customer account to schedule a service visit.</p>
                  <Link to="/login" className="btn btn-primary btn-block" style={{ marginBottom: '8px' }}>
                    Log In to Request Service
                  </Link>
                  <Link to="/register" className="btn btn-secondary btn-block">
                    Register as Customer
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .provider-detail-page {
          padding: 30px 0 60px;
        }

        .breadcrumb-nav {
          margin-bottom: 24px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          font-weight: 600;
          color: var(--primary-teal);
          font-size: 0.95rem;
        }

        .profile-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          align-items: start;
        }

        .profile-hero-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .profile-icon-large {
          width: 80px;
          height: 80px;
          min-width: 80px;
          border-radius: var(--radius-lg);
          background-color: var(--primary-teal-bg);
          border: 2px solid var(--primary-teal-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.6rem;
        }

        .profile-tag-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .profile-name {
          font-size: 1.85rem;
          color: var(--text-dark);
          margin-bottom: 4px;
        }

        .profile-city-lead {
          font-size: 0.95rem;
          color: var(--primary-teal);
          font-weight: 600;
          margin: 0;
        }

        .divider {
          border: none;
          border-top: 1px solid var(--border-color);
          margin: 24px 0;
        }

        .profile-section {
          margin-bottom: 26px;
        }

        .profile-section h3 {
          font-size: 1.15rem;
          margin-bottom: 12px;
          color: var(--text-dark);
        }

        .profile-bio {
          font-size: 0.98rem;
          color: var(--text-body);
          line-height: 1.6;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background-color: #f8fafc;
          padding: 16px;
          border-radius: var(--radius-md);
        }

        .meta-item {
          display: flex;
          flex-direction: column;
        }

        .meta-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }

        .meta-value {
          font-size: 0.95rem;
          color: var(--text-dark);
          font-weight: 600;
          margin-top: 2px;
        }

        .contact-box {
          background-color: var(--primary-teal-bg);
          border: 1px solid var(--primary-teal-light);
          border-radius: var(--radius-md);
          padding: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 10px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .contact-icon {
          font-size: 1.4rem;
        }

        .contact-label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .contact-val {
          font-size: 0.95rem;
          color: var(--text-dark);
          font-weight: 600;
        }

        .contact-disclaimer {
          font-size: 0.78rem;
          color: var(--text-light);
          font-style: italic;
        }

        .booking-action-card {
          position: sticky;
          top: 90px;
        }

        .booking-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 20px;
        }

        @media (max-width: 860px) {
          .profile-layout {
            grid-template-columns: 1fr;
          }

          .meta-grid,
          .contact-box {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
