import api from './api';

export const getProductReviews = async (productId, params = {}) => {
  const response = await api.get(`/products/${productId}/reviews`, { params });
  return response.data.data;
};

export const createProductReview = async (productId, reviewData) => {
  const response = await api.post(`/products/${productId}/reviews`, reviewData);
  return response.data.data.review;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.patch(`/reviews/${reviewId}`, reviewData);
  return response.data.data.review;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data.data;
};

export const getMyReviews = async () => {
  const response = await api.get('/reviews/my');
  return response.data.data.reviews;
};

export default {
  getProductReviews,
  createProductReview,
  updateReview,
  deleteReview,
  getMyReviews
};
