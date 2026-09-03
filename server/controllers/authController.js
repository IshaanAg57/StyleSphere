import User from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Helper to format safe user output
const formatSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  profileImage: user.profileImage,
  addresses: user.addresses || [],
  wishlist: user.wishlist || [],
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

/**
 * @desc    Register a new customer account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // 1. Validation: Required fields
  if (!name || !email || !password) {
    return ApiResponse.error(res, 'Please provide name, email, and password', 400);
  }

  // 2. Validation: Trim and format email
  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return ApiResponse.error(res, 'Please provide a valid email address', 400);
  }

  // 3. Validation: Password length
  if (password.length < 6) {
    return ApiResponse.error(res, 'Password must be at least 6 characters long', 400);
  }

  // 4. Validation: Password match
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return ApiResponse.error(res, 'Passwords do not match', 400);
  }

  // 5. Validation: Check if email already registered
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return ApiResponse.error(res, 'An account with this email address already exists', 400);
  }

  // 6. Create User (defaults to role: 'customer')
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'customer'
  });

  // 7. Generate JWT token
  const token = user.getSignedJwtToken();

  // 8. Return response
  return ApiResponse.success(
    res,
    {
      user: formatSafeUser(user),
      token
    },
    'Customer account registered successfully',
    201
  );
});

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validation: Required fields
  if (!email || !password) {
    return ApiResponse.error(res, 'Please provide both email and password', 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 2. Find user by email and explicitly include password field for verification
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    return ApiResponse.error(res, 'Invalid email or password', 401);
  }

  // 3. Compare password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Invalid email or password', 401);
  }

  // 4. Generate JWT Token
  const token = user.getSignedJwtToken();

  // 5. Return safe user data and token
  return ApiResponse.success(
    res,
    {
      user: formatSafeUser(user),
      token
    },
    'Login successful',
    200
  );
});

/**
 * @desc    Get currently authenticated user's profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by JWT)
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return ApiResponse.error(res, 'User not found', 404);
  }

  return ApiResponse.success(
    res,
    {
      user: formatSafeUser(user)
    },
    'User profile retrieved successfully',
    200
  );
});

/**
 * @desc    Update user profile details
 * @route   PATCH /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, profileImage } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return ApiResponse.error(res, 'User not found', 404);
  }

  if (name) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (profileImage) user.profileImage = profileImage;

  if (email && email.trim().toLowerCase() !== user.email) {
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return ApiResponse.error(res, 'Please provide a valid email address', 400);
    }

    const emailInUse = await User.findOne({ email: normalizedEmail });
    if (emailInUse) {
      return ApiResponse.error(res, 'This email address is already in use by another account', 400);
    }
    user.email = normalizedEmail;
  }

  await user.save();

  return ApiResponse.success(
    res,
    {
      user: formatSafeUser(user)
    },
    'Profile updated successfully',
    200
  );
});

/**
 * @desc    Change user password securely
 * @route   PATCH /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return ApiResponse.error(res, 'Please provide current and new password', 400);
  }

  if (newPassword.length < 6) {
    return ApiResponse.error(res, 'New password must be at least 6 characters long', 400);
  }

  if (confirmPassword !== undefined && newPassword !== confirmPassword) {
    return ApiResponse.error(res, 'New passwords do not match', 400);
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return ApiResponse.error(res, 'User not found', 404);
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return ApiResponse.error(res, 'Incorrect current password', 401);
  }

  user.password = newPassword;
  await user.save();

  return ApiResponse.success(res, null, 'Password updated successfully', 200);
});
