import mongoose from 'mongoose';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * @desc    API Health Check Endpoint
 * @route   GET /api/health
 * @access  Public
 */
export const checkHealth = async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  const healthData = {
    service: 'StyleSphere API',
    status: 'healthy',
    tagline: 'Discover. Personalize. Shop.',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'stylesphere'
    },
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString()
  };

  return ApiResponse.success(res, healthData, 'StyleSphere API is fully operational', 200);
};
