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
  const response = await api.get('/dashboard'); // Need to verify if dashboard exists in api.php
  return response.data;
};

export const updateClinicSettings = async (settingsData) => {
  const response = await api.post('/clinic-settings', settingsData);
  return response.data;
};

// --- Service Rates (Layanan & Tarif) ---
export const getServiceRates = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const getServiceById = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response.data;
};

export const updateService = async (id, serviceData) => {
  const response = await api.put(`/services/${id}`, serviceData);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

// --- Reports (Laporan) ---
export const getFinancialReport = async (startDate, endDate) => {
  const response = await api.get('/reports/financial', { params: { startDate, endDate } });
  return response.data;
};

export const getVisitDemographics = async () => {
  const response = await api.get('/reports/demographics');
  return response.data;
};