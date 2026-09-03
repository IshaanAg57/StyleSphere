import Category from '../models/Category.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ featured: -1, name: 1 });
  return ApiResponse.success(res, { categories }, 'Categories retrieved successfully', 200);
});

/**
 * @desc    Get single category by slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug.toLowerCase() });
  if (!category) {
    return ApiResponse.error(res, 'Category not found', 404);
  }
  return ApiResponse.success(res, { category }, 'Category retrieved successfully', 200);
});
