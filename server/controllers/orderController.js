import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Create a new order from active cart or checkout payload
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'COD', items: directItems } = req.body;

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.city) {
    return ApiResponse.error(res, 'Valid shipping address is required', 400);
  }

  // 1. Determine items to purchase (from payload or user's Cart)
  let itemsToOrder = [];
  let cart = null;

  if (directItems && Array.isArray(directItems) && directItems.length > 0) {
    itemsToOrder = directItems;
  } else {
    cart = await Cart.findOne({ user: req.user._id });
    if (!cart || !cart.items || cart.items.length === 0) {
      return ApiResponse.error(res, 'Your shopping bag is empty. Please add items before checkout.', 400);
    }
    itemsToOrder = cart.items;
  }

  // 2. Validate products and recalculate prices strictly on server
  let subtotal = 0;
  const orderItems = [];

  for (const item of itemsToOrder) {
    const productId = item.product?._id || item.product || item.productId;
    const quantity = parseInt(item.quantity, 10) || 1;
    const selectedSize = item.selectedSize || item.size || 'M';
    const selectedColor = item.selectedColor || item.color || 'Standard';

    const product = await Product.findById(productId);
    if (!product) {
      return ApiResponse.error(res, `Product not found: ${productId}`, 404);
    }

    if (product.stock < quantity) {
      return ApiResponse.error(
        res,
        `Insufficient stock for "${product.name}". Only ${product.stock} units available.`,
        400
      );
    }

    const price = product.price;
    const itemTotal = price * quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      brand: product.brand || 'StyleSphere Collection',
      image: product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      price,
      originalPrice: product.originalPrice || price,
      quantity,
      selectedSize,
      selectedColor
    });
  }

  // 3. Server Calculations
  const discount = Math.round(subtotal * 0.1); // 10% couture savings
  const shippingCost = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.18); // 18% GST
  const totalAmount = Math.max(0, subtotal - discount + shippingCost + tax);

  // 4. Generate unique orderNumber
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `SS-${new Date().getFullYear()}-${randomSuffix}`;

  // 5. Decrement inventory safely
  for (const orderItem of orderItems) {
    await Product.findByIdAndUpdate(orderItem.product, {
      $inc: { stock: -orderItem.quantity }
    });
  }

  // 6. Create Order
  const order = new Order({
    user: req.user._id,
    orderNumber,
    items: orderItems,
    shippingAddress: {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      email: shippingAddress.email || req.user.email,
      addressLine1: shippingAddress.addressLine1 || shippingAddress.street || 'Standard Line 1',
      addressLine2: shippingAddress.addressLine2 || '',
      street: shippingAddress.addressLine1 || shippingAddress.street || 'Standard Line 1',
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode || shippingAddress.pincode || '560001',
      pincode: shippingAddress.postalCode || shippingAddress.pincode || '560001',
      country: shippingAddress.country || 'India'
    },
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' || paymentMethod === 'Cash on Delivery' ? 'cash_on_delivery' : 'pending',
    orderStatus: 'confirmed',
    subtotal,
    discount,
    shippingCost,
    shipping: shippingCost,
    tax,
    totalAmount,
    isPaid: false,
    paidAt: null,
    statusHistory: [
      {
        status: 'Order Placed',
        comment: `Order placed via ${paymentMethod}`,
        timestamp: new Date()
      }
    ]
  });

  const savedOrder = await order.save();

  // 7. Clear user's Cart after order placement
  if (cart) {
    cart.items = [];
    await cart.save();
  } else {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  }

  return ApiResponse.success(res, { order: savedOrder }, 'Order placed successfully', 201);
});

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const totalOrders = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id })
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
    'Orders retrieved successfully',
    200
  );
});

/**
 * @desc    Get order details by ID or orderNumber
 * @route   GET /api/orders/:orderId
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  let order = null;

  // Check if param is valid ObjectId or orderNumber
  if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
    order = await Order.findById(orderId).populate('user', 'name email');
  } else {
    order = await Order.findOne({ orderNumber: orderId }).populate('user', 'name email');
  }

  if (!order) {
    return ApiResponse.error(res, 'Order not found', 404);
  }

  // Verify ownership or Admin privileges
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return ApiResponse.error(res, 'Unauthorized to view this order', 403);
  }

  return ApiResponse.success(res, { order }, 'Order details retrieved successfully', 200);
});
