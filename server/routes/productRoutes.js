import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getProductBySlug
} from '../controllers/productController.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

// Mount nested review routes
router.use('/:productId/reviews', reviewRoutes);

// 1. List Products with query/filters/pagination
router.get('/', getProducts);

// 2. Special feature routes (MUST come before /:slug)
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);

// 3. Single Product by Slug
router.get('/:slug', getProductBySlug);

export default router;
