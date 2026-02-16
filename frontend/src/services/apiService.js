import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: '/api'
});

// Add token to all requests (check both admin and user tokens)
api.interceptors.request.use(
  (config) => {
    // Check for admin token first
    let token = authService.getToken();

    // If no admin token, check for user token
    if (!token) {
      token = localStorage.getItem('userToken');
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Check if it's a user or admin session
      const userType = localStorage.getItem('userType');

      if (userType === 'user') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        window.location.href = '/user/login';
      } else {
        authService.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;