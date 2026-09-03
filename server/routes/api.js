import express from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import cartRoutes from './cartRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import addressRoutes from './addressRoutes.js';
import orderRoutes from './orderRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import adminRoutes from './adminRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const router = express.Router();

// Mount API routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/addresses', addressRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);
router.use('/payment', paymentRoutes);

// Root /api endpoint documentation
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
        me: 'GET /api/auth/me (Protected)',
        updateProfile: 'PATCH /api/auth/profile (Protected)',
        changePassword: 'PATCH /api/auth/change-password (Protected)'
      },
      products: {
        list: 'GET /api/products',
        featured: 'GET /api/products/featured',
        trending: 'GET /api/products/trending',
        details: 'GET /api/products/:slug',
        reviews: 'GET /api/products/:productId/reviews',
        submitReview: 'POST /api/products/:productId/reviews (Protected - Verified Purchase)'
      },
      categories: '/api/categories',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      addresses: '/api/addresses',
      orders: {
        create: 'POST /api/orders (Protected)',
        list: 'GET /api/orders (Protected)',
        details: 'GET /api/orders/:orderId (Protected)',
        invoice: 'GET /api/orders/:orderId/invoice (Protected)'
      },
      payment: {
        config: 'GET /api/payment/config',
        details: 'GET /api/payment/:orderId (Protected)',
        confirm: 'POST /api/payment/:orderId/confirm (Protected)'
      },
      reviews: '/api/reviews',
      admin: {
        dashboard: 'GET /api/admin/dashboard (Admin)',
        products: 'GET, POST, PATCH, DELETE /api/admin/products (Admin)',
        categories: 'GET, POST, PATCH, DELETE /api/admin/categories (Admin)',
        orders: 'GET, PATCH /api/admin/orders (Admin)',
        customers: 'GET /api/admin/customers (Admin)',
        inventory: 'GET, PATCH /api/admin/inventory (Admin)',
        payments: 'GET, PATCH /api/admin/payments (Admin)'
      }
    }
  });
});

export default router;
