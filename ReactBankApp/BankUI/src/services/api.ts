import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // ← Change if your backend runs elsewhere
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Optional: Add token interceptor later for auth
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;