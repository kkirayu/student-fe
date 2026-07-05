import api from './api';

const API_URL = '/suppliers';

export const getSuppliers = async () => {
  const response = await api.get(API_URL);
  return response.data.data;
};

export const getSupplierById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const createSupplier = async (data) => {
  const response = await api.post(API_URL, data);
  return response.data;
};

export const updateSupplier = async (id, data) => {
  const response = await api.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};