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
export const getProducts = async (search = '', page = 1) => {
  try {
    const params = { page };
    if (search) params.search = search;
    const response = await api.get('/products', { params });
    return response.data.data || response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal mengambil data produk.');
  }
};

/**
 * Membuat produk baru
 * @param {Object|FormData} data - Data produk yang baru
 */
export const createProduct = async (data) => {
  try {
    let response;
    if (data instanceof FormData) {
      response = await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      response = await api.post('/products', data);
    }
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal membuat produk.');
  }
};

/**
 * Menghapus produk berdasarkan ID
 * @param {number} id - ID produk
 */
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal menghapus produk.');
  }
};

/**
 * Memperbarui produk berdasarkan ID
 * @param {number} id - ID produk
 * @param {Object} data - Data produk yang diperbarui
 */
export const updateProduct = async (id, data) => {
  try {
    let response;
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      response = await api.post(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      response = await api.put(`/products/${id}`, data);
    }
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal memperbarui produk.');
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

/**
 * Mengambil daftar mutasi stok
 * @param {string} search - Kata kunci pencarian (opsional)
 */
export const getStockMutations = async (search = '') => {
  try {
    const params = {};
    if (search) params.search = search;
    const response = await api.get('/pharmacy/stock-mutations', { params });
    return response.data.data || response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal mengambil data mutasi stok.');
  }
};

/**
 * Membuat mutasi stok baru (Restock / Barang Masuk / Keluar)
 * @param {Object} data - Data mutasi stok
 */
export const createStockMutation = async (data) => {
  try {
    const response = await api.post('/pharmacy/stock-mutations', data);
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal menyimpan mutasi stok.');
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

/**
 * Memperbarui mutasi stok berdasarkan ID
 * @param {number} id - ID mutasi stok
 * @param {Object} data - Data mutasi stok yang diperbarui
 */
export const updateStockMutation = async (id, data) => {
  try {
    const response = await api.put(`/pharmacy/stock-mutations/${id}`, data);
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal memperbarui mutasi stok.');
  }
};
