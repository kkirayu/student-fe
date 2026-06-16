import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/suppliers';

export const getSuppliers = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const getSupplierById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const createSupplier = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateSupplier = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};