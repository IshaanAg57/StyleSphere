import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Helper to compute cart totals from populated items
 */
export const formatCartWithCalculations = (cart) => {
  const items = cart.items || [];

  let subtotal = 0;
  let itemsCount = 0;

  const formattedItems = items.map((item) => {
    const product = item.product;
    const unitPrice =
      (product && product.price) !== undefined ? product.price : item.priceAtAddition || 0;
    const originalPrice = product && product.originalPrice ? product.originalPrice : unitPrice;
    const itemTotal = unitPrice * item.quantity;

    subtotal += itemTotal;
    itemsCount += item.quantity;

    return {
      _id: item._id,
      product: product
        ? {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            brand: product.brand,
            thumbnail: product.thumbnail || product.images?.[0],
            images: product.images || [],
            price: product.price,
            originalPrice: product.originalPrice,
            stock: product.stock
          }
        : null,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      quantity: item.quantity,
      price: unitPrice,
      originalPrice,
      itemTotal
    };
  });

  const discount = Math.round(subtotal * 0.1); // 10% seasonal couture privilege
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.18); // 18% luxury goods tax
  const total = Math.max(0, subtotal - discount + shipping + tax);

  return {
    _id: cart._id,
    user: cart.user,
    items: formattedItems,
    itemsCount,
    subtotal,
    discount,
    shipping,
    tax,
    total
  };
};

/**
 * @desc    Get current user's cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name slug brand thumbnail images price originalPrice stock'
  );

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const responseData = formatCartWithCalculations(cart);
  return ApiResponse.success(res, responseData, 'Cart retrieved successfully', 200);
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, selectedSize = 'M', selectedColor = 'Standard', quantity = 1 } = req.body;

  if (!productId) {
    return ApiResponse.error(res, 'Product ID is required', 400);
  }

  const numQuantity = Math.max(1, parseInt(quantity, 10) || 1);

  // 1. Verify Product & Stock
  const product = await Product.findById(productId);
  if (!product) {
    return ApiResponse.error(res, 'Product not found', 404);
  }

  if (product.stock < numQuantity) {
    return ApiResponse.error(
      res,
      `Insufficient stock. Only ${product.stock} pieces available.`,
      400
    );
  }

  // 2. Find or Create Cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // 3. Check for existing item with same product, size, and color
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId.toString() &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
  );

  if (existingItemIndex > -1) {
    const updatedQuantity = cart.items[existingItemIndex].quantity + numQuantity;
    if (updatedQuantity > product.stock) {
      return ApiResponse.error(
        res,
        `Cannot add more than available stock limit (${product.stock})`,
        400
      );
    }
    cart.items[existingItemIndex].quantity = updatedQuantity;
    cart.items[existingItemIndex].priceAtAddition = product.price;
  } else {
    cart.items.push({
      product: product._id,
      selectedSize,
      selectedColor,
      quantity: numQuantity,
      priceAtAddition: product.price
    });
  }

  await cart.save();

  // Populate and format response
  const populatedCart = await Cart.findById(cart._id).populate(
    'items.product',
    'name slug brand thumbnail images price originalPrice stock'
  );

  const responseData = formatCartWithCalculations(populatedCart);
  return ApiResponse.success(res, responseData, 'Product added to cart successfully', 200);
});

/**
 * @desc    Update cart item quantity
 * @route   PATCH /api/cart/:itemId
 * @access  Private
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined) {
    return ApiResponse.error(res, 'Quantity is required', 400);
  }

  const numQuantity = parseInt(quantity, 10);

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return ApiResponse.error(res, 'Cart not found', 404);
  }

  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
  if (itemIndex === -1) {
    return ApiResponse.error(res, 'Cart item not found', 404);
  }

  if (numQuantity <= 0) {
    // Remove item if quantity set to 0 or negative
    cart.items.splice(itemIndex, 1);
  } else {
    // Validate stock
    const product = await Product.findById(cart.items[itemIndex].product);
    if (product && numQuantity > product.stock) {
      return ApiResponse.error(
        res,
        `Requested quantity exceeds available stock (${product.stock})`,
        400
      );
    }
    cart.items[itemIndex].quantity = numQuantity;
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    'items.product',
    'name slug brand thumbnail images price originalPrice stock'
  );

  const responseData = formatCartWithCalculations(populatedCart);
  return ApiResponse.success(res, responseData, 'Cart item updated successfully', 200);
});

/**
 * @desc    Remove an item from cart
 * @route   DELETE /api/cart/:itemId
 * @access  Private
 */
export const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return ApiResponse.error(res, 'Cart not found', 404);
  }

  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    'items.product',
    'name slug brand thumbnail images price originalPrice stock'
  );

  const responseData = formatCartWithCalculations(populatedCart);
  return ApiResponse.success(res, responseData, 'Item removed from cart', 200);
});

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  } else {
    cart.items = [];
    await cart.save();
  }

  const responseData = formatCartWithCalculations(cart);
  return ApiResponse.success(res, responseData, 'Cart cleared successfully', 200);
});
