import User from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get user's saved shipping addresses
 * @route   GET /api/addresses
 * @access  Private
 */
export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return ApiResponse.success(
    res,
    { addresses: user?.addresses || [] },
    'Addresses retrieved successfully',
    200
  );
});

/**
 * @desc    Add a new shipping address
 * @route   POST /api/addresses
 * @access  Private
 */
export const addAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    email,
    addressLine1,
    addressLine2,
    street,
    city,
    state,
    postalCode,
    pincode,
    country = 'India',
    isDefault = false
  } = req.body;

  if (!fullName || !phone || !city || !state) {
    return ApiResponse.error(res, 'Please provide full name, phone, city, and state', 400);
  }

  const user = await User.findById(req.user._id);

  const shouldBeDefault = isDefault || (user.addresses && user.addresses.length === 0);

  // If this address is set as default, reset other addresses
  if (shouldBeDefault && user.addresses) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  const line1 = addressLine1 || street || 'Standard Address Line';
  const postCode = postalCode || pincode || '560001';

  user.addresses.push({
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : user.email,
    addressLine1: line1,
    addressLine2: addressLine2 || '',
    street: line1,
    city: city.trim(),
    state: state.trim(),
    postalCode: postCode,
    pincode: postCode,
    country: country.trim(),
    isDefault: shouldBeDefault
  });

  await user.save();

  const newAddress = user.addresses[user.addresses.length - 1];

  return ApiResponse.success(
    res,
    {
      addresses: user.addresses,
      newAddress
    },
    'Address added successfully',
    201
  );
});

/**
 * @desc    Update a saved address
 * @route   PATCH /api/addresses/:addressId
 * @access  Private
 */
export const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const updates = req.body;

  const user = await User.findById(req.user._id);
  const address = user.addresses.id(addressId);

  if (!address) {
    return ApiResponse.error(res, 'Address not found', 404);
  }

  if (updates.isDefault === true) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  // Apply updates
  if (updates.fullName) address.fullName = updates.fullName.trim();
  if (updates.phone) address.phone = updates.phone.trim();
  if (updates.email) address.email = updates.email.trim();
  if (updates.addressLine1 || updates.street) {
    const l1 = (updates.addressLine1 || updates.street).trim();
    address.addressLine1 = l1;
    address.street = l1;
  }
  if (updates.addressLine2 !== undefined) address.addressLine2 = updates.addressLine2.trim();
  if (updates.city) address.city = updates.city.trim();
  if (updates.state) address.state = updates.state.trim();
  if (updates.postalCode || updates.pincode) {
    const pc = (updates.postalCode || updates.pincode).trim();
    address.postalCode = pc;
    address.pincode = pc;
  }
  if (updates.country) address.country = updates.country.trim();
  if (updates.isDefault !== undefined) address.isDefault = updates.isDefault;

  await user.save();

  return ApiResponse.success(
    res,
    { addresses: user.addresses, updatedAddress: address },
    'Address updated successfully',
    200
  );
});

/**
 * @desc    Delete a saved address
 * @route   DELETE /api/addresses/:addressId
 * @access  Private
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user._id);
  const address = user.addresses.id(addressId);

  if (!address) {
    return ApiResponse.error(res, 'Address not found', 404);
  }

  const wasDefault = address.isDefault;
  user.addresses.pull({ _id: addressId });

  // If deleted address was default, make the first remaining address default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  return ApiResponse.success(
    res,
    { addresses: user.addresses },
    'Address deleted successfully',
    200
  );
});
