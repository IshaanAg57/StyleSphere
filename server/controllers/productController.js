import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get all products with filtering, search, sorting & pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const {
    q,
    search,
    category,
    gender,
    minPrice,
    maxPrice,
    size,
    color,
    featured,
    trending,
    sort,
    page = 1,
    limit = 12
  } = req.query;

  // Build Query Object
  const query = {};

  // 1. Text Search across name, brand, description, tags
  const searchTerm = q || search;
  if (searchTerm && searchTerm.trim()) {
    const searchRegex = new RegExp(searchTerm.trim(), 'i');
    query.$or = [
      { name: searchRegex },
      { brand: searchRegex },
      { description: searchRegex },
      { shortDescription: searchRegex },
      { tags: searchRegex },
      { material: searchRegex }
    ];
  }

  // 2. Category Filter (by slug or ObjectId)
  if (category && category !== 'all') {
    if (mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    } else {
      const foundCategory = await Category.findOne({ slug: category.toLowerCase().trim() });
      if (foundCategory) {
        query.category = foundCategory._id;
      } else {
        // If category slug not found, return empty results gracefully
        query.category = new mongoose.Types.ObjectId();
      }
    }
  }

  // 3. Gender Filter
  if (gender && gender !== 'all') {
    query.gender = gender.toLowerCase().trim();
  }

  // 4. Price Range Filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined && !isNaN(Number(minPrice))) {
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
      query.price.$lte = Number(maxPrice);
    }
  }

  // 5. Size Filter
  if (size && size !== 'all') {
    query.sizes = { $in: [size] };
  }

  // 6. Color Filter
  if (color && color !== 'all') {
    query.colors = { $in: [new RegExp(color.trim(), 'i')] };
  }

  // 7. Featured & Trending Flags
  if (featured === 'true' || featured === true) {
    query.featured = true;
  }
  if (trending === 'true' || trending === true) {
    query.trending = true;
  }

  // Sorting Options
  let sortOption = { createdAt: -1 }; // default newest
  if (sort === 'price_asc') {
    sortOption = { price: 1 };
  } else if (sort === 'price_desc') {
    sortOption = { price: -1 };
  } else if (sort === 'rating' || sort === 'highest_rated') {
    sortOption = { ratingsAverage: -1 };
  } else if (sort === 'newest') {
    sortOption = { createdAt: -1 };
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * pageLimit;

  // Execute Count & Query
  const totalProducts = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug image')
    .sort(sortOption)
    .skip(skip)
    .limit(pageLimit);

  const totalPages = Math.ceil(totalProducts / pageLimit) || 1;
  const hasMore = pageNum < totalPages;

  return ApiResponse.success(
    res,
    {
      products,
      totalProducts,
      page: pageNum,
      limit: pageLimit,
      totalPages,
      hasMore
    },
    'Products retrieved successfully',
    200
  );
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = Math.min(20, parseInt(req.query.limit, 10) || 8);
  const products = await Product.find({ featured: true })
    .populate('category', 'name slug')
    .sort({ ratingsAverage: -1, createdAt: -1 })
    .limit(limit);

  return ApiResponse.success(res, { products }, 'Featured products retrieved successfully', 200);
});

/**
 * @desc    Get trending products
 * @route   GET /api/products/trending
 * @access  Public
 */
export const getTrendingProducts = asyncHandler(async (req, res) => {
  const limit = Math.min(20, parseInt(req.query.limit, 10) || 8);
  const products = await Product.find({ trending: true })
    .populate('category', 'name slug')
    .sort({ ratingsQuantity: -1, ratingsAverage: -1 })
    .limit(limit);

  return ApiResponse.success(res, { products }, 'Trending products retrieved successfully', 200);
});

/**
 * @desc    Get single product by slug or ID with related products
 * @route   GET /api/products/:slug
 * @access  Public
 */
export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Query by slug, fallback to ObjectId if valid
  let product = await Product.findOne({ slug: slug.toLowerCase() }).populate(
    'category',
    'name slug description image'
  );

  if (!product && mongoose.Types.ObjectId.isValid(slug)) {
    product = await Product.findById(slug).populate(
      'category',
      'name slug description image'
    );
  }

  if (!product) {
    return ApiResponse.error(res, `Product not found with slug or ID: ${slug}`, 404);
  }

  // Fetch up to 4 related products matching same category or gender, excluding current product
  const relatedQuery = {
    _id: { $ne: product._id }
  };
  if (product.category) {
    relatedQuery.category = product.category._id || product.category;
  }

  const relatedProducts = await Product.find(relatedQuery)
    .populate('category', 'name slug')
    .limit(4);

  return ApiResponse.success(
    res,
    {
      product,
      relatedProducts
    },
    'Product details retrieved successfully',
    200
  );
});
