import api from './api';

// Fungsi helper untuk standarisasi penanganan error Axios
const handleServiceError = (error, defaultMessage) => {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(defaultMessage);
};

/**
 * Mengambil semua produk untuk halaman Stock Monitoring
 * @param {string} search - Kata kunci pencarian (opsional)
 */
export const getProducts = async (search = '') => {
  try {
    const params = {};
    if (search) params.search = search;
    const response = await api.get('/pharmacy/products', { params });
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal mengambil data produk.');
  }
};

/**
 * Menghapus produk berdasarkan ID
 * @param {number} id - ID produk
 */
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/pharmacy/products/${id}`);
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal menghapus produk.');
  }
};

/**
 * Mengambil daftar resep (E-Prescription)
 * @param {string} search - Kata kunci pencarian (opsional)
 */
export const getPrescriptions = async (search = '') => {
  try {
    const params = {};
    if (search) params.search = search;
    const response = await api.get('/pharmacy/prescriptions', { params });
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal mengambil data resep.');
  }
};

/**
 * Update status resep (Pending → Ditebus / Selesai)
 * @param {number} medicalRecordId - ID medical record
 * @param {string} status - Status baru ('Pending' atau 'Ditebus')
 */
export const updatePrescriptionStatus = async (medicalRecordId, status) => {
  try {
    const response = await api.patch(`/pharmacy/prescriptions/${medicalRecordId}/status`, { status });
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal mengubah status resep.');
  }
};
