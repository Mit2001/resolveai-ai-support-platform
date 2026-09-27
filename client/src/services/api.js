import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('resolveai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauth or token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired and not on public pages
      const publicPaths = ['/login', '/register', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        localStorage.removeItem('resolveai_token');
        localStorage.removeItem('resolveai_user');
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Tickets API
export const ticketsApi = {
  getTickets: (params) => api.get('/tickets', { params }),
  getTicketById: (id) => api.get(`/tickets/${id}`),
  createTicket: (data) => api.post('/tickets', data),
  updateTicket: (id, data) => api.patch(`/tickets/${id}`, data),
  deleteTicket: (id) => api.delete(`/tickets/${id}`),
};

// Messages API
export const messagesApi = {
  getMessages: (ticketId) => api.get(`/tickets/${ticketId}/messages`),
  sendMessage: (ticketId, data) => api.post(`/tickets/${ticketId}/messages`, data),
};

// Customers API
export const customersApi = {
  getCustomers: () => api.get('/customers'),
  getCustomerById: (id) => api.get(`/customers/${id}`),
};

// AI API
export const aiApi = {
  analyzeTicket: (data) => api.post('/ai/analyze-ticket', data),
  generateResponse: (data) => api.post('/ai/generate-response', data),
  chatAssistant: (data) => api.post('/ai/chat', data),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getTicketsAnalytics: () => api.get('/analytics/tickets'),
};

// Team API
export const teamApi = {
  getTeam: () => api.get('/team'),
  addTeamMember: (data) => api.post('/team', data),
  updateTeamMember: (id, data) => api.patch(`/team/${id}`, data),
};

export default api;
