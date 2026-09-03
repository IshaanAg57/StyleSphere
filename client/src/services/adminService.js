import api from './api';

// 1. Dashboard
export const getDashboardAnalytics = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data.data;
};

// 2. Products
export const getAdminProducts = async (params = {}) => {
  const response = await api.get('/admin/products', { params });
  return response.data.data;
};

export const createAdminProduct = async (productData) => {
  const response = await api.post('/admin/products', productData);
  return response.data.data.product;
};

export const updateAdminProduct = async (productId, productData) => {
  const response = await api.patch(`/admin/products/${productId}`, productData);
  return response.data.data.product;
};

export const deleteAdminProduct = async (productId) => {
  const response = await api.delete(`/admin/products/${productId}`);
  return response.data.data;
};

export const updateProductStock = async (productId, stock) => {
  const response = await api.patch(`/admin/products/${productId}/stock`, { stock });
  return response.data.data.product;
};

// 3. Categories
export const getAdminCategories = async () => {
  const response = await api.get('/admin/categories');
  return response.data.data.categories;
};

export const createAdminCategory = async (categoryData) => {
  const response = await api.post('/admin/categories', categoryData);
  return response.data.data.category;
};

export const updateAdminCategory = async (categoryId, categoryData) => {
  const response = await api.patch(`/admin/categories/${categoryId}`, categoryData);
  return response.data.data.category;
};

export const deleteAdminCategory = async (categoryId) => {
  const response = await api.delete(`/admin/categories/${categoryId}`);
  return response.data.data;
};

// 4. Orders
export const getAdminOrders = async (params = {}) => {
  const response = await api.get('/admin/orders', { params });
  return response.data.data;
};

export const getAdminOrderById = async (orderId) => {
  const response = await api.get(`/admin/orders/${orderId}`);
  return response.data.data.order;
};

export const updateAdminOrderStatus = async (orderId, statusData) => {
  const response = await api.patch(`/admin/orders/${orderId}/status`, statusData);
  return response.data.data.order;
};

// 5. Customers
export const getAdminCustomers = async (params = {}) => {
  const response = await api.get('/admin/customers', { params });
  return response.data.data;
};

export const getAdminCustomerById = async (userId) => {
  const response = await api.get(`/admin/customers/${userId}`);
  return response.data.data;
};

// 6. Inventory
export const getAdminInventory = async () => {
  const response = await api.get('/admin/inventory');
  return response.data.data;
};

// 7. Payment Verification
export const getAdminPayments = async (params = {}) => {
  const response = await api.get('/admin/payments', { params });
  return response.data.data;
};

export const verifyAdminPayment = async (orderId) => {
  const response = await api.patch(`/admin/payments/${orderId}/verify`);
  return response.data.data.order;
};

export const rejectAdminPayment = async (orderId, reason) => {
  const response = await api.patch(`/admin/payments/${orderId}/reject`, { reason });
  return response.data.data.order;
};

export default {
  getDashboardAnalytics,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateProductStock,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  getAdminCustomers,
  getAdminCustomerById,
  getAdminInventory,
  getAdminPayments,
  verifyAdminPayment,
  rejectAdminPayment
};
