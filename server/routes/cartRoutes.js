import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/', clearCart);

router.patch('/:itemId', updateCartItem);
router.delete('/:itemId', removeCartItem);

export default router;
