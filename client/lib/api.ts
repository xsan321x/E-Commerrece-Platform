import axios from 'axios';
import { handleAuthError } from './authUtils';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} - Token present`);
    } else {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} - NO TOKEN`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API Success] ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Handle authentication errors globally
    if (error.response?.status === 401) {
      console.log('[API] 401 Error:', {
        url: error.config?.url,
        message: error.response?.data?.message,
        method: error.config?.method,
        fullResponse: error.response?.data,
      });
      
      // Use handleAuthError to determine if this is a token issue
      // Only logout if it's a genuine authentication failure
      const wasHandled = handleAuthError(error);
      console.log('[API] Was 401 handled as logout?', wasHandled);
    }
    
    return Promise.reject(error);
  }
);

export default api;
