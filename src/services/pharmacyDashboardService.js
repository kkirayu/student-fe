import api, { handleServiceError } from './api';

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/pharmacy/dashboard');
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal mengambil data statistik dashboard.');
  }
};

export const getLowStockMedicines = async () => {
  try {
    const response = await api.get('/pharmacy/low-stock');
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal memuat data stok obat tipis.');
  }
};

export const getPatientDemographics = async () => {
  try {
    const response = await api.get('/pharmacy/patient-demographics');
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal memuat data demografi pasien.');
  }
};