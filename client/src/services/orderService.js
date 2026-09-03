import api from './api';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data.data.order;
};

export const getMyOrders = async (params = {}) => {
  const response = await api.get('/orders', { params });
  return response.data.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data.data.order;
};

export default {
  createOrder,
  getMyOrders,
  getOrderById
};
