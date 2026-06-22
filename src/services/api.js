import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('auth_token');
  // Ini token sementara untuk testing, nanti diganti dengan mekanisme autentikasi yang sebenarnya (misal: ambil dari localStorage atau context)
  const token = "adR9hWZ2BGLv47kCBP8ufwkTRozRNIy32qo2UMH56b4f6521"; 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;