import api from './api';

// Fungsi helper untuk standarisasi penanganan error Axios
const handleServiceError = (error, defaultMessage) => {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(defaultMessage);
};

/**
 * Mengambil daftar mutasi stok
 * @param {string} search - Kata kunci pencarian (opsional)
 */
export const getStockMutations = async (search = '') => {
  try {
    const params = {};
    if (search) params.search = search;
    const response = await api.get('/pharmacy/stock-mutations', { params });
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal mengambil data mutasi stok.');
  }
};

/**
 * Menghapus mutasi stok berdasarkan ID
 * @param {number} id - ID mutasi stok
 */
export const deleteStockMutation = async (id) => {
  try {
    const response = await api.delete(`/pharmacy/stock-mutations/${id}`);
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal menghapus mutasi stok.');
  }
};