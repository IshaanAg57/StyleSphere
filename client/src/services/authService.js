import api from './api';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data.data.user;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch('/auth/profile', profileData);
  return response.data.data.user;
};

export const changePassword = async (passwordData) => {
  const response = await api.patch('/auth/change-password', passwordData);
  return response.data;
};

export default {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
};
