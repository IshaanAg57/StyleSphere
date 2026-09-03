import User from '../models/User.js';
import Product from '../models/Product.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get logged-in user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    populate: { path: 'category', select: 'name slug' }
  });

  return ApiResponse.success(
    res,
    { wishlist: user?.wishlist || [] },
    'Wishlist retrieved successfully',
    200
  );
});

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist/:productId
 * @access  Private
 */
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return ApiResponse.error(res, 'Product not found', 404);
  }

  const user = await User.findById(req.user._id);

  // Prevent duplicate additions
  const alreadyWishlisted = user.wishlist.some(
    (id) => id.toString() === productId.toString()
  );

  if (!alreadyWishlisted) {
    user.wishlist.push(product._id);
    await user.save();
  }

  const updatedUser = await User.findById(req.user._id).populate({
    path: 'wishlist',
    populate: { path: 'category', select: 'name slug' }
  });

  return ApiResponse.success(
    res,
    { wishlist: updatedUser.wishlist },
    'Product added to wishlist',
    200
  );
});

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== productId.toString()
  );

  await user.save();

  const updatedUser = await User.findById(req.user._id).populate({
    path: 'wishlist',
    populate: { path: 'category', select: 'name slug' }
  });

  return ApiResponse.success(
    res,
    { wishlist: updatedUser.wishlist },
    'Product removed from wishlist',
    200
  );
});
