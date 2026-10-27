// Centralized API Client for NearFix
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('nearfix_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Authentication
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    getMe: () => request('/auth/me'),
  },

  // Categories (Strictly 3 fixed services)
  categories: {
    getAll: () => request('/categories'),
  },

  // Providers (Strictly 3 demo providers)
  providers: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.service && params.service !== 'All') query.append('service', params.service);
      if (params.locality && params.locality !== 'All') query.append('locality', params.locality);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return request(`/providers${queryString}`);
    },
    getById: (id) => request(`/providers/${id}`),
    updateAvailability: (id, availability_status) =>
      request(`/providers/${id}/availability`, {
        method: 'PATCH',
        body: JSON.stringify({ availability_status }),
      }),
  },

  // Service Requests (Customer Bookings)
  requests: {
    create: (data) => request('/requests', { method: 'POST', body: JSON.stringify(data) }),
    getCustomerRequests: () => request('/requests/customer'),
    getProviderRequests: () => request('/requests/provider'),
    updateStatus: (id, status) =>
      request(`/requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Admin Dashboard
  admin: {
    getStats: () => request('/admin/stats'),
    toggleProviderStatus: (id, is_active) =>
      request(`/admin/providers/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active }),
      }),
  },
};
