import api from './api';

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data.data;
};

export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}`);
  return response.data.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get('/products/featured');
  return response.data.data.products;
};

export const getTrendingProducts = async () => {
  const response = await api.get('/products/trending');
  return response.data.data.products;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data.data.categories;
};

export default {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getTrendingProducts,
  getCategories
};
