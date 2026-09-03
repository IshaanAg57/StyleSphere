import api from './api';

export const getAddresses = async () => {
  const response = await api.get('/addresses');
  return response.data.data.addresses;
};

export const addAddress = async (addressData) => {
  const response = await api.post('/addresses', addressData);
  return response.data.data;
};

export const updateAddress = async (addressId, addressData) => {
  const response = await api.patch(`/addresses/${addressId}`, addressData);
  return response.data.data;
};

export const deleteAddress = async (addressId) => {
  const response = await api.delete(`/addresses/${addressId}`);
  return response.data.data;
};

export default {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
