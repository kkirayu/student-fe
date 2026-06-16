import api from './api';

export const getCustomers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// --- Dashboard & Settings ---
export const getAdminDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const updateClinicSettings = async (settingsData) => {
  const response = await api.put('/admin/settings', settingsData);
  return response.data;
};

// --- Service Rates (Layanan & Tarif) ---
export const getServiceRates = async () => {
  const response = await api.get('/admin/services');
  return response.data;
};

export const getServiceById = async (id) => {
  const response = await api.get(`/admin/services/${id}`);
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await api.post('/admin/services', serviceData);
  return response.data;
};

export const updateService = async (id, serviceData) => {
  const response = await api.put(`/admin/services/${id}`, serviceData);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/admin/services/${id}`);
  return response.data;
};

// --- Reports (Laporan) ---
export const getFinancialReport = async (startDate, endDate) => {
  const response = await api.get('/admin/reports/financial', { params: { startDate, endDate } });
  return response.data;
};

export const getVisitDemographics = async () => {
  const response = await api.get('/admin/reports/demographics');
  return response.data;
};