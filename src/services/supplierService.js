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
  let response;
  if (data instanceof FormData) {
    response = await api.post(API_URL, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  } else {
    response = await api.post(API_URL, data);
  }
  return response.data;
};

export const updateSupplier = async (id, data) => {
  let response;
  if (data instanceof FormData) {
    data.append('_method', 'PUT');
    response = await api.post(`${API_URL}/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  } else {
    response = await api.put(`${API_URL}/${id}`, data);
  }
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};