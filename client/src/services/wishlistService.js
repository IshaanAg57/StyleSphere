import api from './api';

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data.data.wishlist;
};

export const addToWishlist = async (productId) => {
  const response = await api.post(`/wishlist/${productId}`);
  return response.data.data.wishlist;
};

export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data.data.wishlist;
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
