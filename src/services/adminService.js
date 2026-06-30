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
  const response = await api.get('/admin/dashboard/summary');
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
  const response = await api.get('/reports/financial', { params: { start_date: startDate, end_date: endDate } });
  return response.data;
};

export const getVisitDemographics = async (startDate, endDate) => {
  const response = await api.get('/reports/demographics', { params: { start_date: startDate, end_date: endDate } });
  return response.data;
};

export const getStockMutationReport = async (startDate, endDate) => {
  const response = await api.get('/reports/stock-mutation', { params: { start_date: startDate, end_date: endDate } });
  return response.data;
};

// --- Clinic Settings (Pengaturan Klinik) ---
export const getClinicSettings = async () => {
  const response = await api.get('/clinic-settings');
  return response.data;
};

export const updateClinicSettings = async (formData) => {
  // Use config to ensure content type is multipart/form-data
  const response = await api.post('/clinic-settings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const downloadDatabaseBackup = async () => {
  const response = await api.get('/backup-database', { responseType: 'blob' });
  return response.data;
};