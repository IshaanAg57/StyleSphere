import api from './api';

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data.data;
};

export const addToCart = async ({ productId, selectedSize, selectedColor, quantity }) => {
  const response = await api.post('/cart', {
    productId,
    selectedSize,
    selectedColor,
    quantity
  });
  return response.data.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.patch(`/cart/${itemId}`, { quantity });
  return response.data.data;
};

export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data.data;
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
