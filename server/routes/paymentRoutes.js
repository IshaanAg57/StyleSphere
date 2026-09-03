import express from 'express';
import {
  getPaymentConfig,
  getOrderPaymentDetails,
  submitPaymentConfirmation,
  getOrderInvoice
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/config', getPaymentConfig);
router.get('/:orderId', protect, getOrderPaymentDetails);
router.post('/:orderId/confirm', protect, submitPaymentConfirmation);
router.get('/:orderId/invoice', protect, getOrderInvoice);

export default router;
