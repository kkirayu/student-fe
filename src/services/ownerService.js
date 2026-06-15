import api from './api';

// --- Owner / User Profile ---
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data; // { success: true, data: { ... } }
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const getPets = async (params = {}) => {
  const response = await api.get('/pets', { params });
  return response.data;
};

export const getPetById = async (id) => {
  const response = await api.get(`/pets/${id}`);
  return response.data;
};

export const createPet = async (petData) => {
  const response = await api.post('/pets', petData);
  return response.data;
};

export const updatePet = async (id, petData) => {
  const response = await api.put(`/pets/${id}`, petData);
  return response.data;
};

export const deletePet = async (id) => {
  const response = await api.delete(`/pets/${id}`);
  return response.data;
};

export const getServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await api.get('/appointments');
  return response.data;
};

export const getAppointmentById = async (id) => {
  const response = await api.get(`/appointments/${id}`);
  return response.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const response = await api.put(`/appointments/${id}`, appointmentData);
  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};
