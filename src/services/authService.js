import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerOwner = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const verifyOtp = async (otpCode) => {
  const response = await api.post('/auth/verify-otp', { otp: otpCode });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};