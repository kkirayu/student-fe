import api from './api';

const handleServiceError = (error, defaultMessage) => {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(defaultMessage);
};

export const createRestock = async (data) => {
  try {
    const response = await api.post('/pharmacy/stock-mutations', data);
    return response.data;
  } catch (error) {
    handleServiceError(error, 'Gagal menyimpan data restock.');
  }
};
