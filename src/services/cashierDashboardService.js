import api, { handleServiceError } from './api';

export const getCashierDashboardStats = async () => {
  try {
    const response = await api.get('/cashier/dashboard');
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal mengambil data dashboard kasir.');
  }
};
