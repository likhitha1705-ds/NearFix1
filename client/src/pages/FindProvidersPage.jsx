import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProviderCard from '../components/ProviderCard';
import { api } from '../services/api';

export default function FindProvidersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialService = searchParams.get('service') || 'All';
  const initialLocality = searchParams.get('locality') || 'All';

  const [serviceFilter, setServiceFilter] = useState(initialService);
  const [localityFilter, setLocalityFilter] = useState(initialLocality);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fallback 3 fictional demo providers in case server is starting
  const defaultProviders = [
    // 3 Electricians
    {
      id: 1,
      name: 'Rahul Sharma',
      service_category: 'Electrician',
      locality: 'Andheri West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 3,
      description: 'Electrical installation, wiring checks, and minor electrical repairs.',
      availability_status: 'Available',
      category_icon: '⚡',
    },
    {
      id: 2,
      name: 'Kiran Verma',
      service_category: 'Electrician',
      locality: 'Bandra West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 5,
      description: 'Residential and commercial wiring diagnostics, MCB replacement, and fixture setups.',
      availability_status: 'Available',
      category_icon: '⚡',
    },
    {
      id: 3,
      name: 'Sanjay Rao',
      service_category: 'Electrician',
      locality: 'Dadar, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 4,
      description: 'Home inverter installations, circuit breaker troubleshooting, and lighting maintenance.',
      availability_status: 'Available',
      category_icon: '⚡',
    },

    // 3 Plumbers
    {
      id: 4,
      name: 'Amit Patil',
      service_category: 'Plumber',
      locality: 'Dadar, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 4,
      description: 'Tap repairs, water leakage, and basic pipe maintenance.',
      availability_status: 'Available',
      category_icon: '🔧',
    },
    {
      id: 5,
      name: 'Ganesh Shinde',
      service_category: 'Plumber',
      locality: 'Andheri West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 6,
      description: 'Bathroom fittings, pipeline leakage inspection, and water pressure motor maintenance.',
      availability_status: 'Available',
      category_icon: '🔧',
    },
    {
      id: 6,
      name: 'Prashant More',
      service_category: 'Plumber',
      locality: 'Bandra West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 3,
      description: 'Kitchen sink drainage unclogging, geyser pipeline connections, and valve repairs.',
      availability_status: 'Available',
      category_icon: '🔧',
    },

    // 3 AC Repairs
    {
      id: 7,
      name: 'Neha Deshmukh',
      service_category: 'AC Repair',
      locality: 'Bandra West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 3,
      description: 'AC cleaning, routine servicing, and basic cooling issue checks.',
      availability_status: 'Available',
      category_icon: '❄️',
    },
    {
      id: 8,
      name: 'Sameer Khan',
      service_category: 'AC Repair',
      locality: 'Andheri West, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 5,
      description: 'Split and window AC gas refilling, compressor diagnostics, and filter sanitization.',
      availability_status: 'Available',
      category_icon: '❄️',
    },
    {
      id: 9,
      name: 'Vikram Joshi',
      service_category: 'AC Repair',
      locality: 'Dadar, Mumbai',
      city: 'Mumbai, Maharashtra',
      experience_years: 4,
      description: 'Copper piping repair, PCB board troubleshooting, and seasonal preventive maintenance.',
      availability_status: 'Available',
      category_icon: '❄️',
    },
  ];

  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      setError('');
      try {
        const res = await api.providers.getAll({
          service: serviceFilter,
          locality: localityFilter === 'All' ? '' : localityFilter.trim(),
        });
        if (res.success && res.providers) {
          setProviders(res.providers);
        } else {
          // Filter fallback data locally
          filterLocalDemoProviders();
        }
      } catch (err) {
        console.warn('Backend provider load failed, using local filtering:', err.message);
        filterLocalDemoProviders();
      } finally {
        setLoading(false);
      }
    }

    function filterLocalDemoProviders() {
      let filtered = [...defaultProviders];
      if (serviceFilter && serviceFilter !== 'All') {
        filtered = filtered.filter(
          (p) => p.service_category.toLowerCase() === serviceFilter.toLowerCase()
        );
      }
      if (localityFilter && localityFilter !== 'All' && localityFilter.trim() !== '') {
        filtered = filtered.filter((p) =>
          p.locality.toLowerCase().includes(localityFilter.toLowerCase().trim())
        );
      }
      setProviders(filtered);
    }

    fetchProviders();

    // Update query params in URL
    const nextParams = new URLSearchParams();
    if (serviceFilter && serviceFilter !== 'All') nextParams.set('service', serviceFilter);
    if (localityFilter && localityFilter !== 'All' && localityFilter.trim() !== '') {
      nextParams.set('locality', localityFilter.trim());
    }
    setSearchParams(nextParams);
  }, [serviceFilter, localityFilter]);

  const handleResetFilters = () => {
    setServiceFilter('All');
    setLocalityFilter('');
  };

  return (
    <div className="find-providers-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Find the local service provider</h1>
          <p>
            Connect with verified professionals for fast, dependable home repairs.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="filter-card">
          <div className="filter-grid">
            {/* Service Category Filter */}
            <div className="filter-group">
              <label htmlFor="service-filter" className="form-label">
                Filter by Service
              </label>
              <select
                id="service-filter"
                className="form-select"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="All">All Services</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="AC Repair">AC Repair</option>
              </select>
            </div>

            {/* Locality Filter */}
            <div className="filter-group">
              <label htmlFor="locality-filter" className="form-label">
                Filter by Locality
              </label>
              <input
                id="locality-filter"
                type="text"
                className="form-input"
                placeholder="Type any area or locality (or leave blank)..."
                value={localityFilter === 'All' ? '' : localityFilter}
                onChange={(e) => setLocalityFilter(e.target.value)}
              />
            </div>

            {/* Clear Filters Button */}
            <div className="filter-actions">
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-secondary btn-block"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Status / Results Count */}
        <div className="results-status-bar">
          <span className="results-count">
            Showing <strong>{providers.length}</strong> service provider{providers.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Providers Listing */}
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading providers...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : providers.length === 0 ? (
          <div className="card no-results-card">
            <div className="no-results-icon">🔍</div>
            <h3>No Providers Found Matching Filters</h3>
            <p>
              No service providers currently match the selected service category and locality combination.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary">
              Clear Filters & View All Providers
            </button>
          </div>
        ) : (
          <div className="grid-3 providers-grid">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .find-providers-page {
          padding-bottom: 60px;
        }

        .filter-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }

        .filter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 20px;
          align-items: flex-end;
        }

        .filter-actions {
          min-width: 130px;
        }

        .results-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 0 4px;
          font-size: 0.92rem;
          color: var(--text-muted);
        }

        .city-indicator {
          font-weight: 600;
          color: var(--primary-teal);
        }

        .no-results-card {
          text-align: center;
          padding: 60px 20px;
          max-width: 550px;
          margin: 0 auto;
        }

        .no-results-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .filter-grid {
            grid-template-columns: 1fr;
          }

          .results-status-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
}
