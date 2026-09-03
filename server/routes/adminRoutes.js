import express from 'express';
import {
  getDashboardAnalytics,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
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
  updateAdminProductStock,
  getAdminPayments,
  verifyAdminPayment,
  rejectAdminPayment
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Enforce Admin Authentication on all routes
router.use(protect);
router.use(authorize('admin'));

// 1. Dashboard Analytics
router.get('/dashboard', getDashboardAnalytics);

// 2. Product Management
router.route('/products')
  .get(getAdminProducts)
  .post(createAdminProduct);

router.route('/products/:productId')
  .patch(updateAdminProduct)
  .delete(deleteAdminProduct);

router.patch('/products/:productId/stock', updateAdminProductStock);

// 3. Category Management
router.route('/categories')
  .get(getAdminCategories)
  .post(createAdminCategory);

router.route('/categories/:categoryId')
  .patch(updateAdminCategory)
  .delete(deleteAdminCategory);

// 4. Order Management
router.get('/orders', getAdminOrders);
router.get('/orders/:orderId', getAdminOrderById);
router.patch('/orders/:orderId/status', updateAdminOrderStatus);

// 5. Customer Management
router.get('/customers', getAdminCustomers);
router.get('/customers/:userId', getAdminCustomerById);

// 6. Inventory Management
router.get('/inventory', getAdminInventory);

// 7. Payment Verification Center
router.get('/payments', getAdminPayments);
router.patch('/payments/:orderId/verify', verifyAdminPayment);
router.patch('/payments/:orderId/reject', rejectAdminPayment);

export default router;
