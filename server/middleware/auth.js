import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes via JWT verification
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'stylesphere_super_secret_jwt_key_2026_dev'
      );

      // Find user by id (excluding password hash)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          statusCode: 401,
          success: false,
          message: 'User belonging to this token no longer exists',
          timestamp: new Date().toISOString()
        });
      }

      // Attach user to request object
      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      let message = 'Not authorized, token failed';
      if (error.name === 'TokenExpiredError') {
        message = 'Not authorized, token has expired';
      } else if (error.name === 'JsonWebTokenError') {
        message = 'Not authorized, invalid token format';
      }

      return res.status(401).json({
        statusCode: 401,
        success: false,
        message,
        timestamp: new Date().toISOString()
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      success: false,
      message: 'Not authorized, no token provided in Authorization header',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Middleware to grant access based on specific user roles
 * @param  {...string} roles - Allowed roles (e.g. 'admin', 'customer')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        statusCode: 403,
        success: false,
        message: `User role '${req.user?.role || 'anonymous'}' is not authorized to access this resource`,
        timestamp: new Date().toISOString()
      });
    }
    next();
  };
};
