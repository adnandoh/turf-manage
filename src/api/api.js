import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  console.log(`🏏 ADMIN API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ADMIN API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ ADMIN API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    return Promise.reject(error);
  }
);

// Authentication
export const authService = {
  login: (credentials) => {
    return api.post('/api-token-auth/', credentials).then(response => {
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response;
    });
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};

// Cricket APIs
export const cricketService = {
  getSlots: (date) => {
    return api.get(`/api/cricket/slots/?date=${date}`);
  },
  
  getBookings: (date) => {
    return api.get(`/api/cricket/bookings/?date=${date}`);
  },
  
  createBlock: (blockData) => {
    return api.post('/api/cricket/blocks/', blockData);
  },
  
  removeBlock: (id) => {
    return api.delete(`/api/cricket/blocks/${id}/`);
  },
  
  // Block all slots for a specific date
  blockDate: (date, reason) => {
    // Use a single API call to block all slots for a date
    // This reduces multiple API calls and improves performance
    return api.post('/api/cricket/blocks/block-date/', {
      date: date,
      reason: reason
    });
  },
  
  // Block multiple dates at once
  blockDates: (dates, reason) => {
    const promises = dates.map(date => 
      cricketService.blockDate(date, reason)
    );
    
    return Promise.all(promises);
  }
};

// Pickle Ball APIs
export const pickleballService = {
  getSlots: (date) => {
    return api.get(`/api/pickleball/slots/?date=${date}`);
  },
  
  getBookings: (date) => {
    return api.get(`/api/pickleball/bookings/?date=${date}`);
  },
  
  createBlock: (blockData) => {
    return api.post('/api/pickleball/blocks/', blockData);
  },
  
  removeBlock: (id) => {
    return api.delete(`/api/pickleball/blocks/${id}/`);
  },
  
  // Block all slots for a specific date
  blockDate: (date, reason) => {
    // Use a single API call to block all slots for a date
    // This reduces multiple API calls and improves performance
    return api.post('/api/pickleball/blocks/block-date/', {
      date: date,
      reason: reason
    });
  },
  
  // Block multiple dates at once
  blockDates: (dates, reason) => {
    const promises = dates.map(date => 
      pickleballService.blockDate(date, reason)
    );
    
    return Promise.all(promises);
  }
};

// Dashboard API
export const dashboardService = {
  getDashboardData: () => {
    return api.get('/api/admin/dashboard/');
  }
};

export default api; 