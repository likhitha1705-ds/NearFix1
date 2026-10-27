import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { api } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState('All');
  const [locality, setLocality] = useState('');

  // Fallback fixed 3 categories in case API is loading or network pause
  const defaultCategories = [
    {
      id: 1,
      name: 'Electrician',
      description: 'Electrical installation and repair.',
      icon: '⚡',
    },
    {
      id: 2,
      name: 'Plumber',
      description: 'Water leaks, taps, and pipe repairs.',
      icon: '🔧',
    },
    {
      id: 3,
      name: 'AC Repair',
      description: 'Air-conditioner servicing and repair.',
      icon: '❄️',
    },
  ];

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.categories.getAll();
        if (res.success && res.categories && res.categories.length > 0) {
          setCategories(res.categories);
        } else {
          setCategories(defaultCategories);
        }
      } catch (err) {
        console.warn('Using default categories:', err.message);
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedService && selectedService !== 'All') {
      params.append('service', selectedService);
    }
    // Extract locality name if user typed a specific locality or kept default
    const cleanLocality = locality.replace('Mumbai, Maharashtra', '').trim();
    if (cleanLocality) {
      params.append('locality', cleanLocality);
    }
    navigate(`/providers?${params.toString()}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <h1 className="hero-title">Find the local service provider</h1>
          <p className="hero-subtitle">
            NearFix connects you with trusted local repair professionals for quick, dependable home maintenance.
          </p>

          {/* Search Bar */}
          <div className="search-box-card">
            <form onSubmit={handleSearch} className="search-form">
              {/* Service Selection Dropdown */}
              <div className="search-field">
                <label htmlFor="service-select" className="search-label">
                  Service Category
                </label>
                <select
                  id="service-select"
                  className="form-select search-input"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="All">All Services</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="AC Repair">AC Repair</option>
                </select>
              </div>

              {/* Location Input */}
              <div className="search-field">
                <label htmlFor="location-input" className="search-label">
                  Locality / Area
                </label>
                <input
                  id="location-input"
                  type="text"
                  className="form-input search-input"
                  placeholder="Enter your area, locality, or street"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary search-submit-btn">
                🔍 Search Providers
              </button>
            </form>
          </div>

          <div className="quick-tags">
            <span className="quick-tag-label">Popular Services:</span>
            <button
              type="button"
              className="quick-tag-btn"
              onClick={() => {
                navigate('/providers?service=Electrician');
              }}
            >
              ⚡ Electrician
            </button>
            <button
              type="button"
              className="quick-tag-btn"
              onClick={() => {
                navigate('/providers?service=Plumber');
              }}
            >
              🔧 Plumber
            </button>
            <button
              type="button"
              className="quick-tag-btn"
              onClick={() => {
                navigate('/providers?service=AC+Repair');
              }}
            >
              ❄️ AC Repair
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Repair Services</h2>
            <p>
              Professional, high-quality household repairs right at your doorstep.
            </p>
          </div>

          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p>Loading services...</p>
            </div>
          ) : (
            <div className="grid-3">
              {categories.map((category) => (
                <ServiceCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Schedule your household repairs in 3 simple steps.</p>
          </div>

          <div className="grid-3 steps-grid">
            {/* Step 1 */}
            <div className="card step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Select a Service</h3>
              <p className="step-desc">
                Choose between Electrician, Plumber, or AC Repair based on your repair need.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Find a Provider</h3>
              <p className="step-desc">
                Browse verified local provider profiles and check real-time availability in your area.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Contact the Provider</h3>
              <p className="step-desc">
                View contact details or submit an instant booking request to schedule your repair.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          background: linear-gradient(180deg, #ffffff 0%, var(--primary-teal-bg) 100%);
          padding: 60px 0 70px;
          border-bottom: 1px solid var(--border-color);
          text-align: center;
        }

        .hero-container {
          max-width: 860px;
        }

        .city-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #ffffff;
          border: 1px solid var(--primary-teal-light);
          color: var(--primary-teal-hover);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 600;
          margin-bottom: 18px;
          box-shadow: var(--shadow-sm);
        }

        .hero-title {
          font-size: 2.75rem;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 16px;
          letter-spacing: -0.03em;
        }

        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 34px;
        }

        .search-box-card {
          background-color: #ffffff;
          padding: 20px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
        }

        .search-form {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 16px;
          align-items: flex-end;
          text-align: left;
        }

        .search-field {
          display: flex;
          flex-direction: column;
        }

        .search-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 6px;
        }

        .search-input {
          height: 46px;
        }

        .search-submit-btn {
          height: 46px;
          padding: 0 24px;
          white-space: nowrap;
        }

        .quick-tags {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
          font-size: 0.85rem;
        }

        .quick-tag-label {
          color: var(--text-muted);
          font-weight: 500;
        }

        .quick-tag-btn {
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          color: var(--text-body);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .quick-tag-btn:hover {
          border-color: var(--primary-teal);
          color: var(--primary-teal);
        }

        .services-section {
          padding: 60px 0;
        }

        .section-header {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 40px;
        }

        .section-header h2 {
          font-size: 1.85rem;
          color: var(--text-dark);
          margin-bottom: 10px;
        }

        .section-header p {
          color: var(--text-muted);
          font-size: 1rem;
        }

        .how-it-works-section {
          padding: 60px 0;
          background-color: #ffffff;
          border-top: 1px solid var(--border-color);
        }

        .step-card {
          text-align: center;
          padding: 30px 20px;
          border-radius: var(--radius-lg);
          position: relative;
        }

        .step-number {
          width: 44px;
          height: 44px;
          background-color: var(--primary-teal);
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0 auto 16px;
        }

        .step-title {
          font-size: 1.18rem;
          margin-bottom: 8px;
          color: var(--text-dark);
        }

        .step-desc {
          font-size: 0.92rem;
          color: var(--text-muted);
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .search-form {
            grid-template-columns: 1fr;
          }

          .search-submit-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
