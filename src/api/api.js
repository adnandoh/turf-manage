import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
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
    // Create blocks for all 24 hours of the day
    const promises = [];
    for (let hour = 0; hour < 24; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1) % 24}`.padStart(2, '0') + ':00';
      
      const blockData = {
        date: date,
        start_time: startTime,
        end_time: endTime,
        reason: reason
      };
      
      promises.push(api.post('/api/cricket/blocks/', blockData));
    }
    
    return Promise.all(promises);
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
    // Create blocks for all 24 hours of the day
    const promises = [];
    for (let hour = 0; hour < 24; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1) % 24}`.padStart(2, '0') + ':00';
      
      const blockData = {
        date: date,
        start_time: startTime,
        end_time: endTime,
        reason: reason
      };
      
      promises.push(api.post('/api/pickleball/blocks/', blockData));
    }
    
    return Promise.all(promises);
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