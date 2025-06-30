import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { ApiError } from '../types';
import { config } from '../utils/config';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Default error response
  const errorResponse: ApiError = {
    success: false,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    statusCode: 500,
  };

  // Handle specific error types
  if (err.message.includes('Failed to fetch')) {
    errorResponse.statusCode = 503;
    errorResponse.error = 'Service Unavailable';
    errorResponse.message = 'Database service is temporarily unavailable';
  } else if (err.message.includes('Invalid wood type')) {
    errorResponse.statusCode = 400;
    errorResponse.error = 'Bad Request';
    errorResponse.message = 'Invalid wood type specified';
  } else if (err.message.includes('not found')) {
    errorResponse.statusCode = 404;
    errorResponse.error = 'Not Found';
    errorResponse.message = 'Requested resource not found';
  }

  // Don't expose internal errors in production
  if (config.NODE_ENV === 'production' && errorResponse.statusCode === 500) {
    errorResponse.message = 'An unexpected error occurred';
  } else if (config.NODE_ENV === 'development') {
    errorResponse.message = err.message;
  }

  res.status(errorResponse.statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  const errorResponse: ApiError = {
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
  };

  res.status(404).json(errorResponse);
};

/**
 * Rate limiting middleware
 */
export const createRateLimit = () => {
  return rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    message: {
      success: false,
      error: 'Too Many Requests',
      message: 'Too many requests from this IP, please try again later',
      statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: 'Too many requests from this IP, please try again later',
        statusCode: 429,
      });
    },
  });
};

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

/**
 * Validate wood type parameter
 */
export const validateWoodType = (req: Request, res: Response, next: NextFunction) => {
  const validTypes = ['domestic', 'exotic', 'plywood'];
  const woodType = req.params.type || req.query.type;

  if (!woodType || !validTypes.includes(woodType as string)) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Invalid wood type. Must be one of: domestic, exotic, plywood',
      statusCode: 400,
    });
  }

  next();
};

/**
 * CORS preflight handler
 */
export const corsPreflightHandler = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', config.CORS_ORIGIN);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Max-Age', '86400');
    return res.sendStatus(200);
  }
  next();
};

/**
 * Security headers middleware
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};