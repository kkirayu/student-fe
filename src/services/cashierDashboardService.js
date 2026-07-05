import api from './api';

const handleServiceError = (error, defaultMessage) => {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(defaultMessage);
};

export const getCashierDashboardStats = async () => {
  try {
    const response = await api.get('/cashier/dashboard');
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal mengambil data dashboard kasir.');
  }
};
