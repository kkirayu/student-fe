import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const studentsApi = {
  getAll: (params?: any) => api.get('/students', { params }),
  getById: (id: string) => api.get(`/students/${id}`),
  create: (student: any) => api.post('/students', student),
  update: (id: string, student: any) => api.patch(`/students/${id}`, student),
  delete: (id: string) => api.delete(`/students/${id}`),
  uploadProfilePicture: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/students/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
