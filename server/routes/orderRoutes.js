import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById
} from '../controllers/orderController.js';
import { getOrderInvoice } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:orderId', getOrderById);
router.get('/:orderId/invoice', getOrderInvoice);

export default router;
