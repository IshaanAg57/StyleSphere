import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const LOW_STOCK_THRESHOLD = 5;

// ==========================================
// 1. DASHBOARD ANALYTICS
// ==========================================

/**
 * @desc    Get complete real-time dashboard analytics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  // 1. Core Metrics
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  // Revenue calculation from non-cancelled orders
  const revenueAgg = await Order.aggregate([
    { $match: { orderStatus: { $nin: ['cancelled', 'Cancelled'] } } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  // Pending / In-progress orders
  const pendingOrders = await Order.countDocuments({
    orderStatus: { $in: ['pending', 'confirmed', 'Order Placed', 'Processing', 'processing'] }
  });

  // Low stock products count
  const lowStockCount = await Product.countDocuments({
    stock: { $lte: LOW_STOCK_THRESHOLD }
  });

  // 2. Recent Orders
  const recentOrders = await Order.find()
    .populate('user', 'name email profileImage')
    .sort({ createdAt: -1 })
    .limit(6);

  // 3. Low Stock Products Preview
  const lowStockProducts = await Product.find({ stock: { $lte: LOW_STOCK_THRESHOLD } })
    .select('name slug brand thumbnail images stock price category')
    .populate('category', 'name')
    .limit(6);

  // 4. Order Status Breakdown
  const statusDistributionAgg = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
  ]);
  const orderStatusDistribution = {};
  statusDistributionAgg.forEach((s) => {
    orderStatusDistribution[s._id] = s.count;
  });

  return ApiResponse.success(
    res,
    {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockProductsCount: lowStockCount,
      recentOrders,
      lowStockProducts,
      orderStatusDistribution,
      lowStockThreshold: LOW_STOCK_THRESHOLD
    },
    'Admin dashboard analytics retrieved successfully',
    200
  );
});

// ==========================================
// 2. PRODUCT MANAGEMENT
// ==========================================

/**
 * @desc    Get admin product catalog with filtering and search
 * @route   GET /api/admin/products
 * @access  Private (Admin)
 */
export const getAdminProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 15);
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.q) {
    query.$or = [
      { name: { $regex: req.query.q, $options: 'i' } },
      { brand: { $regex: req.query.q, $options: 'i' } }
    ];
  }

  if (req.query.category && req.query.category !== 'all') {
    query.category = req.query.category;
  }

  if (req.query.stockStatus === 'low') {
    query.stock = { $gt: 0, $lte: LOW_STOCK_THRESHOLD };
  } else if (req.query.stockStatus === 'out') {
    query.stock = { $lte: 0 };
  }

  const totalProducts = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return ApiResponse.success(
    res,
    {
      products,
      totalProducts,
      page,
      totalPages: Math.ceil(totalProducts / limit) || 1,
      lowStockThreshold: LOW_STOCK_THRESHOLD
    },
    'Admin products retrieved successfully',
    200
  );
});

/**
 * @desc    Create a new luxury product
 * @route   POST /api/admin/products
 * @access  Private (Admin)
 */
export const createAdminProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    shortDescription,
    category,
    brand,
    gender,
    price,
    originalPrice,
    images,
    thumbnail,
    colors,
    sizes,
    stock,
    material,
    tags,
    featured,
    trending,
    isNewArrival
  } = req.body;

  if (!name || !price || !category) {
    return ApiResponse.error(res, 'Please provide product name, price, and category', 400);
  }

  const product = new Product({
    name: name.trim(),
    description: description?.trim() || '',
    shortDescription: shortDescription?.trim() || '',
    category,
    brand: brand?.trim() || 'StyleSphere Haute Couture',
    gender: gender || 'unisex',
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : Number(price),
    images: Array.isArray(images) && images.length > 0 ? images : [thumbnail || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'],
    thumbnail: thumbnail || (Array.isArray(images) && images[0]) || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    colors: Array.isArray(colors) ? colors : ['Standard'],
    sizes: Array.isArray(sizes) ? sizes : ['M'],
    stock: Math.max(0, parseInt(stock, 10) || 0),
    material: material?.trim() || 'Artisanal Silk & Cashmere',
    tags: Array.isArray(tags) ? tags : [],
    featured: Boolean(featured),
    trending: Boolean(trending),
    isNewArrival: Boolean(isNewArrival)
  });

  const createdProduct = await product.save();

  return ApiResponse.success(res, { product: createdProduct }, 'Product created successfully', 201);
});

/**
 * @desc    Update an existing product
 * @route   PATCH /api/admin/products/:productId
 * @access  Private (Admin)
 */
export const updateAdminProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updates = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return ApiResponse.error(res, 'Product not found', 404);
  }

  // Update fields
  if (updates.name) product.name = updates.name.trim();
  if (updates.description !== undefined) product.description = updates.description.trim();
  if (updates.shortDescription !== undefined) product.shortDescription = updates.shortDescription.trim();
  if (updates.category) product.category = updates.category;
  if (updates.brand) product.brand = updates.brand.trim();
  if (updates.gender) product.gender = updates.gender;
  if (updates.price !== undefined) product.price = Number(updates.price);
  if (updates.originalPrice !== undefined) product.originalPrice = Number(updates.originalPrice);
  if (updates.images) product.images = updates.images;
  if (updates.thumbnail) product.thumbnail = updates.thumbnail;
  if (updates.colors) product.colors = updates.colors;
  if (updates.sizes) product.sizes = updates.sizes;
  if (updates.stock !== undefined) product.stock = Math.max(0, parseInt(updates.stock, 10));
  if (updates.material !== undefined) product.material = updates.material.trim();
  if (updates.tags) product.tags = updates.tags;
  if (updates.featured !== undefined) product.featured = Boolean(updates.featured);
  if (updates.trending !== undefined) product.trending = Boolean(updates.trending);
  if (updates.isNewArrival !== undefined) product.isNewArrival = Boolean(updates.isNewArrival);

  const updatedProduct = await product.save();

  return ApiResponse.success(res, { product: updatedProduct }, 'Product updated successfully', 200);
});

/**
 * @desc    Delete a product safely
 * @route   DELETE /api/admin/products/:productId
 * @access  Private (Admin)
 */
export const deleteAdminProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return ApiResponse.error(res, 'Product not found', 404);
  }

  await Product.findByIdAndDelete(productId);

  return ApiResponse.success(res, null, 'Product deleted successfully', 200);
});

// ==========================================
// 3. CATEGORY MANAGEMENT
// ==========================================

/**
 * @desc    Get all categories with product counts for admin
 * @route   GET /api/admin/categories
 * @access  Private (Admin)
 */
export const getAdminCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  // Count products for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const productCount = await Product.countDocuments({ category: cat._id });
      return {
        ...cat.toObject(),
        productCount
      };
    })
  );

  return ApiResponse.success(res, { categories: categoriesWithCounts }, 'Categories retrieved successfully', 200);
});

/**
 * @desc    Create a category
 * @route   POST /api/admin/categories
 * @access  Private (Admin)
 */
export const createAdminCategory = asyncHandler(async (req, res) => {
  const { name, description, gender, image, featured } = req.body;

  if (!name) {
    return ApiResponse.error(res, 'Category name is required', 400);
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const existingCat = await Category.findOne({ slug });
  if (existingCat) {
    return ApiResponse.error(res, 'Category with this name or slug already exists', 400);
  }

  const category = await Category.create({
    name: name.trim(),
    slug,
    description: description?.trim() || '',
    gender: gender || 'unisex',
    image: image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    featured: Boolean(featured)
  });

  return ApiResponse.success(res, { category }, 'Category created successfully', 201);
});

/**
 * @desc    Update a category
 * @route   PATCH /api/admin/categories/:categoryId
 * @access  Private (Admin)
 */
export const updateAdminCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const updates = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    return ApiResponse.error(res, 'Category not found', 404);
  }

  if (updates.name) category.name = updates.name.trim();
  if (updates.description !== undefined) category.description = updates.description.trim();
  if (updates.gender) category.gender = updates.gender;
  if (updates.image) category.image = updates.image;
  if (updates.featured !== undefined) category.featured = Boolean(updates.featured);

  const updated = await category.save();

  return ApiResponse.success(res, { category: updated }, 'Category updated successfully', 200);
});

/**
 * @desc    Delete a category
 * @route   DELETE /api/admin/categories/:categoryId
 * @access  Private (Admin)
 */
export const deleteAdminCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    return ApiResponse.error(res, 'Category not found', 404);
  }

  // Check if any product belongs to this category
  const associatedProducts = await Product.countDocuments({ category: categoryId });
  if (associatedProducts > 0) {
    return ApiResponse.error(
      res,
      `Cannot delete category. ${associatedProducts} products are currently associated with it.`,
      400
    );
  }

  await Category.findByIdAndDelete(categoryId);

  return ApiResponse.success(res, null, 'Category deleted successfully', 200);
});

// ==========================================
// 4. ORDER MANAGEMENT
// ==========================================

/**
 * @desc    Get all orders with pagination and status filters
 * @route   GET /api/admin/orders
 * @access  Private (Admin)
 */
export const getAdminOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 15);
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.orderNumber) {
    query.orderNumber = { $regex: req.query.orderNumber, $options: 'i' };
  }

  if (req.query.orderStatus && req.query.orderStatus !== 'all') {
    query.orderStatus = req.query.orderStatus;
  }

  if (req.query.paymentStatus && req.query.paymentStatus !== 'all') {
    query.paymentStatus = req.query.paymentStatus;
  }

  const totalOrders = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return ApiResponse.success(
    res,
    {
      orders,
      totalOrders,
      page,
      totalPages: Math.ceil(totalOrders / limit) || 1
    },
    'Admin orders retrieved successfully',
    200
  );
});

/**
 * @desc    Get admin order details
 * @route   GET /api/admin/orders/:orderId
 * @access  Private (Admin)
 */
export const getAdminOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  let order = null;
  if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
    order = await Order.findById(orderId).populate('user', 'name email phone profileImage');
  } else {
    order = await Order.findOne({ orderNumber: orderId }).populate('user', 'name email phone profileImage');
  }

  if (!order) {
    return ApiResponse.error(res, 'Order not found', 404);
  }

  return ApiResponse.success(res, { order }, 'Admin order details retrieved successfully', 200);
});

/**
 * @desc    Update order status and fulfillment progression
 * @route   PATCH /api/admin/orders/:orderId/status
 * @access  Private (Admin)
 */
export const updateAdminOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, paymentStatus, comment } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return ApiResponse.error(res, 'Order not found', 404);
  }

  const allowedStatuses = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'Order Placed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  if (orderStatus && !allowedStatuses.includes(orderStatus)) {
    return ApiResponse.error(res, `Invalid order status. Allowed: ${allowedStatuses.join(', ')}`, 400);
  }

  if (orderStatus) {
    order.orderStatus = orderStatus;
    order.statusHistory.push({
      status: orderStatus,
      comment: comment || `Status transitioned to ${orderStatus} by Admin`,
      timestamp: new Date()
    });

    if (orderStatus.toLowerCase() === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
    if (paymentStatus.toLowerCase() === 'paid') {
      order.isPaid = true;
      order.paidAt = new Date();
    }
  }

  const updatedOrder = await order.save();

  return ApiResponse.success(res, { order: updatedOrder }, 'Order status updated successfully', 200);
});

// ==========================================
// 5. CUSTOMER MANAGEMENT
// ==========================================

/**
 * @desc    Get all customers with order statistics
 * @route   GET /api/admin/customers
 * @access  Private (Admin)
 */
export const getAdminCustomers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 15);
  const skip = (page - 1) * limit;

  const query = { role: 'customer' };

  if (req.query.q) {
    query.$or = [
      { name: { $regex: req.query.q, $options: 'i' } },
      { email: { $regex: req.query.q, $options: 'i' } }
    ];
  }

  const totalCustomers = await User.countDocuments(query);
  const customers = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Attach order summary for each customer
  const customersWithStats = await Promise.all(
    customers.map(async (cust) => {
      const orderCount = await Order.countDocuments({ user: cust._id });
      const spendAgg = await Order.aggregate([
        { $match: { user: cust._id, orderStatus: { $nin: ['cancelled', 'Cancelled'] } } },
        { $group: { _id: null, totalSpent: { $sum: '$totalAmount' } } }
      ]);
      const totalSpent = spendAgg[0]?.totalSpent || 0;

      return {
        ...cust.toObject(),
        orderCount,
        totalSpent
      };
    })
  );

  return ApiResponse.success(
    res,
    {
      customers: customersWithStats,
      totalCustomers,
      page,
      totalPages: Math.ceil(totalCustomers / limit) || 1
    },
    'Customers retrieved successfully',
    200
  );
});

/**
 * @desc    Get specific customer details and order history
 * @route   GET /api/admin/customers/:userId
 * @access  Private (Admin)
 */
export const getAdminCustomerById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const customer = await User.findById(userId).select('-password');
  if (!customer) {
    return ApiResponse.error(res, 'Customer not found', 404);
  }

  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

  return ApiResponse.success(
    res,
    {
      customer,
      orders
    },
    'Customer details retrieved successfully',
    200
  );
});

// ==========================================
// 6. INVENTORY MANAGEMENT
// ==========================================

/**
 * @desc    Get complete inventory with stock status
 * @route   GET /api/admin/inventory
 * @access  Private (Admin)
 */
export const getAdminInventory = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .select('name slug brand thumbnail images price originalPrice stock category')
    .populate('category', 'name')
    .sort({ stock: 1 });

  const inventory = products.map((prod) => {
    let stockStatus = 'In Stock';
    if (prod.stock <= 0) {
      stockStatus = 'Out of Stock';
    } else if (prod.stock <= LOW_STOCK_THRESHOLD) {
      stockStatus = 'Low Stock';
    }

    return {
      _id: prod._id,
      name: prod.name,
      slug: prod.slug,
      brand: prod.brand,
      thumbnail: prod.thumbnail,
      price: prod.price,
      stock: prod.stock,
      category: prod.category?.name || 'Uncategorized',
      stockStatus
    };
  });

  return ApiResponse.success(
    res,
    {
      inventory,
      lowStockThreshold: LOW_STOCK_THRESHOLD,
      totalItems: inventory.length,
      lowStockCount: inventory.filter((i) => i.stockStatus === 'Low Stock').length,
      outOfStockCount: inventory.filter((i) => i.stockStatus === 'Out of Stock').length
    },
    'Inventory retrieved successfully',
    200
  );
});

/**
 * @desc    Quick update product stock
 * @route   PATCH /api/admin/products/:productId/stock
 * @access  Private (Admin)
 */
export const updateAdminProductStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { stock } = req.body;

  if (stock === undefined) {
    return ApiResponse.error(res, 'Stock value is required', 400);
  }

  const numStock = Math.max(0, parseInt(stock, 10));

  const product = await Product.findByIdAndUpdate(
    productId,
    { stock: numStock },
    { new: true }
  );

  if (!product) {
    return ApiResponse.error(res, 'Product not found', 404);
  }

  return ApiResponse.success(res, { product }, 'Stock updated successfully', 200);
});

// ==========================================
// 7. PAYMENT MANAGEMENT & MANUAL VERIFICATION
// ==========================================

/**
 * @desc    Get all payments and verification center metrics
 * @route   GET /api/admin/payments
 * @access  Private (Admin)
 */
export const getAdminPayments = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 15);
  const skip = (page - 1) * limit;

  // Build filter query
  const query = {};

  if (req.query.paymentStatus && req.query.paymentStatus !== 'all') {
    query.paymentStatus = req.query.paymentStatus;
  }

  if (req.query.paymentMethod && req.query.paymentMethod !== 'all') {
    query.paymentMethod = req.query.paymentMethod;
  }

  if (req.query.q) {
    query.$or = [
      { orderNumber: { $regex: req.query.q, $options: 'i' } },
      { paymentReference: { $regex: req.query.q, $options: 'i' } }
    ];
  }

  // Calculate Metrics
  const awaitingVerification = await Order.countDocuments({ paymentStatus: 'pending_verification' });
  const verifiedPayments = await Order.countDocuments({ paymentStatus: 'paid' });
  const rejectedPayments = await Order.countDocuments({ paymentStatus: 'rejected' });

  const upiRevenueAgg = await Order.aggregate([
    { $match: { paymentMethod: 'UPI', paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalUpiRevenue = upiRevenueAgg[0]?.total || 0;

  const pendingAmountAgg = await Order.aggregate([
    { $match: { paymentStatus: 'pending_verification' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const pendingAmount = pendingAmountAgg[0]?.total || 0;

  const totalPayments = await Order.countDocuments(query);
  const payments = await Order.find(query)
    .populate('user', 'name email phone profileImage')
    .populate('paymentVerifiedBy', 'name email')
    .sort({ paymentSubmittedAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return ApiResponse.success(
    res,
    {
      payments,
      totalPayments,
      page,
      totalPages: Math.ceil(totalPayments / limit) || 1,
      metrics: {
        awaitingVerification,
        verifiedPayments,
        rejectedPayments,
        totalUpiRevenue,
        pendingAmount
      }
    },
    'Admin payments retrieved successfully',
    200
  );
});

/**
 * @desc    Manually verify customer UPI payment
 * @route   PATCH /api/admin/payments/:orderId/verify
 * @access  Private (Admin)
 */
export const verifyAdminPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  let order = null;
  if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
    order = await Order.findById(orderId);
  } else {
    order = await Order.findOne({ orderNumber: orderId });
  }

  if (!order) {
    return ApiResponse.error(res, 'Order not found', 404);
  }

  if (order.paymentStatus === 'paid' && order.isPaid) {
    return ApiResponse.error(res, 'Payment for this order has already been verified and confirmed', 400);
  }

  order.paymentStatus = 'paid';
  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentVerifiedAt = new Date();
  order.paymentVerifiedBy = req.user._id;
  order.paymentRejectionReason = '';

  if (order.orderStatus === 'pending' || order.orderStatus === 'Order Placed') {
    order.orderStatus = 'confirmed';
  }

  order.statusHistory.push({
    status: 'Payment Confirmed',
    comment: `Manual UPI payment verification confirmed by Executive Admin: ${req.user.name}`,
    timestamp: new Date()
  });

  const updatedOrder = await order.save();

  return ApiResponse.success(
    res,
    { order: updatedOrder },
    'Payment successfully verified and order confirmed',
    200
  );
});

/**
 * @desc    Manually reject customer UPI payment with reason
 * @route   PATCH /api/admin/payments/:orderId/reject
 * @access  Private (Admin)
 */
export const rejectAdminPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return ApiResponse.error(res, 'Please provide a clear rejection reason for the customer', 400);
  }

  let order = null;
  if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
    order = await Order.findById(orderId);
  } else {
    order = await Order.findOne({ orderNumber: orderId });
  }

  if (!order) {
    return ApiResponse.error(res, 'Order not found', 404);
  }

  order.paymentStatus = 'rejected';
  order.isPaid = false;
  order.paymentRejectionReason = reason.trim();

  order.statusHistory.push({
    status: 'Payment Rejected',
    comment: `Payment verification rejected by Executive Admin. Reason: ${reason.trim()}`,
    timestamp: new Date()
  });

  const updatedOrder = await order.save();

  return ApiResponse.success(
    res,
    { order: updatedOrder },
    'Payment rejected and rejection notification recorded',
    200
  );
});
