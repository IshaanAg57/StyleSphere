import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Helper to verify whether user has purchased the product
 */
export const checkUserPurchaseEligibility = async (userId, productId) => {
  const order = await Order.findOne({
    user: userId,
    'items.product': productId,
    orderStatus: { $nin: ['cancelled', 'Cancelled'] }
  });

  return Boolean(order);
};

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/products/:productId/reviews
 * @access  Public
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const product = await Product.findById(productId);
  if (!product) {
    return ApiResponse.error(res, 'Product not found', 404);
  }

  const totalReviews = await Review.countDocuments({ product: productId });
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Compute rating distribution
  const allReviewsForProduct = await Review.find({ product: productId }).select('rating');
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  allReviewsForProduct.forEach((r) => {
    if (distribution[r.rating] !== undefined) {
      distribution[r.rating]++;
    }
  });

  return ApiResponse.success(
    res,
    {
      reviews,
      totalReviews,
      page,
      totalPages: Math.ceil(totalReviews / limit) || 1,
      ratingsAverage: product.ratingsAverage || 4.8,
      ratingsQuantity: totalReviews,
      distribution
    },
    'Product reviews retrieved successfully',
    200
  );
});

/**
 * @desc    Create a product review (Verified Purchase Only)
 * @route   POST /api/products/:productId/reviews
 * @access  Private
 */
export const createProductReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title, comment } = req.body;

  if (!rating || !title || !comment) {
    return ApiResponse.error(res, 'Please provide a star rating, title, and review comment', 400);
  }

  const numRating = Number(rating);
  if (numRating < 1 || numRating > 5) {
    return ApiResponse.error(res, 'Rating must be an integer between 1 and 5', 400);
  }

  const product = await Product.findById(productId);
  if (!product) {
    return ApiResponse.error(res, 'Product not found', 404);
  }

  // 1. Check if user has already reviewed this product
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId
  });

  if (existingReview) {
    return ApiResponse.error(
      res,
      'You have already submitted a review for this creation. You may edit your existing review.',
      400
    );
  }

  // 2. Check verified purchase eligibility
  const isEligible = await checkUserPurchaseEligibility(req.user._id, productId);
  if (!isEligible) {
    return ApiResponse.error(
      res,
      'Only verified clients who have acquired and received this piece can submit a review.',
      403
    );
  }

  // 3. Create review
  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: numRating,
    title: title.trim(),
    comment: comment.trim(),
    verifiedPurchase: true
  });

  // 4. Recalculate average rating on product
  await Review.calculateAverageRating(product._id);

  const populatedReview = await Review.findById(review._id).populate('user', 'name profileImage');

  return ApiResponse.success(res, { review: populatedReview }, 'Review submitted successfully', 201);
});

/**
 * @desc    Update an existing review
 * @route   PATCH /api/reviews/:reviewId
 * @access  Private
 */
export const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) {
    return ApiResponse.error(res, 'Review not found', 404);
  }

  // Check ownership
  if (review.user.toString() !== req.user._id.toString()) {
    return ApiResponse.error(res, 'Unauthorized to edit this review', 403);
  }

  if (rating !== undefined) {
    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return ApiResponse.error(res, 'Rating must be between 1 and 5', 400);
    }
    review.rating = numRating;
  }

  if (title) review.title = title.trim();
  if (comment) review.comment = comment.trim();

  await review.save();

  // Recalculate average rating on product
  await Review.calculateAverageRating(review.product);

  const updated = await Review.findById(review._id).populate('user', 'name profileImage');

  return ApiResponse.success(res, { review: updated }, 'Review updated successfully', 200);
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:reviewId
 * @access  Private
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    return ApiResponse.error(res, 'Review not found', 404);
  }

  // Check ownership or Admin role
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return ApiResponse.error(res, 'Unauthorized to delete this review', 403);
  }

  const productId = review.product;
  await Review.findByIdAndDelete(reviewId);

  // Recalculate average rating on product
  await Review.calculateAverageRating(productId);

  return ApiResponse.success(res, null, 'Review deleted successfully', 200);
});

/**
 * @desc    Get all reviews by current user
 * @route   GET /api/reviews/my
 * @access  Private
 */
export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate('product', 'name slug brand thumbnail images price')
    .sort({ createdAt: -1 });

  return ApiResponse.success(res, { reviews }, 'User reviews retrieved successfully', 200);
});
