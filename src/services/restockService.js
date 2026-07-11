import api, { handleServiceError } from './api';

export const createRestock = async (data) => {
  try {
    const response = await api.post('/pharmacy/stock-mutations', data);
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal menyimpan data restock.');
  }
};
