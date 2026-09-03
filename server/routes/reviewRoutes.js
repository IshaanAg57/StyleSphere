import express from 'express';
import {
  getProductReviews,
  createProductReview,
  updateReview,
  deleteReview,
  getMyReviews
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// Route mounted at /api/reviews AND /api/products/:productId/reviews
router.get('/my', protect, getMyReviews);
router.patch('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

router.route('/')
  .get(getProductReviews)
  .post(protect, createProductReview);

export default router;
