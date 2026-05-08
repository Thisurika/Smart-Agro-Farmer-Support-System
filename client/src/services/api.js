import axios from 'axios';

/**
 * Centralized Axios instance with interceptors
 * - Automatically attaches JWT token to requests
 * - Handles 401 responses globally (auto-logout)
 * - Standardizes error handling
 */
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// ─── Request Interceptor ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo?.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
      } catch {
        // Invalid JSON in localStorage — clean up
        localStorage.removeItem('userInfo');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto-logout on 401 (expired/invalid token)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Don't redirect if already on auth pages
      if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
    }

    // Extract a clean error message
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

export default api;
export { API_URL };
