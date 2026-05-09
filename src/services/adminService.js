import api from './api';

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

// --- Reports (Laporan) ---
export const getFinancialReport = async (startDate, endDate) => {
  const response = await api.get('/admin/reports/financial', { params: { startDate, endDate } });
  return response.data;
};

export const getVisitDemographics = async () => {
  const response = await api.get('/admin/reports/demographics');
  return response.data;
};