import api from './api';

export const getPaymentConfig = async () => {
  const response = await api.get('/payment/config');
  return response.data.data;
};

export const getOrderPaymentDetails = async (orderId) => {
  const response = await api.get(`/payment/${orderId}`);
  return response.data.data;
};

export const submitPaymentConfirmation = async (orderId, paymentData) => {
  const response = await api.post(`/payment/${orderId}/confirm`, paymentData);
  return response.data.data.order;
};

export const getOrderInvoice = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/invoice`);
  return response.data.data.order;
};

export default {
  getPaymentConfig,
  getOrderPaymentDetails,
  submitPaymentConfirmation,
  getOrderInvoice
};
