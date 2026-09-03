import express from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';

const router = express.Router();

// Mount API routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

// Root /api endpoint information
router.get('/', (req, res) => {
  res.json({
    name: 'StyleSphere REST API',
    tagline: 'Discover. Personalize. Shop.',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (Protected)'
      },
      products: {
        list: 'GET /api/products?q=&category=&gender=&minPrice=&maxPrice=&size=&color=&sort=&page=&limit=',
        featured: 'GET /api/products/featured',
        trending: 'GET /api/products/trending',
        details: 'GET /api/products/:slug'
      },
      categories: {
        list: 'GET /api/categories',
        details: 'GET /api/categories/:slug'
      },
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      orders: '/api/orders',
      reviews: '/api/reviews',
      payments: '/api/payments',
      admin: '/api/admin'
    }
  });
});

export default router;
