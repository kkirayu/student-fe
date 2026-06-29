import api from './api';

const handleServiceError = (error, defaultMessage) => {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(defaultMessage);
};

/**
 * Memproses pembayaran POS
 * @param {Object} paymentData - Data pembayaran
 */
export const processPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal memproses pembayaran.');
  }
};

/**
 * Membuat Invoice baru
 * @param {Object} invoiceData - Data invoice
 */
export const createInvoice = async (invoiceData) => {
  try {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal membuat invoice.');
  }
};
