import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './utils/config';
import { initializeDatabase } from './utils/database';
import routes from './routes';
import {
  errorHandler,
  notFoundHandler,
  createRateLimit,
  requestLogger,
  corsPreflightHandler,
  securityHeaders,
} from './middleware';

// Create Express app
const app = express();

// Initialize database connection
initializeDatabase(config);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle CORS preflight requests
app.use(corsPreflightHandler);

// Security headers
app.use(securityHeaders);

// Rate limiting
if (config.NODE_ENV === 'production') {
  app.use('/api/', createRateLimit());
}

// Request logging
if (config.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Hardwood Species Selector API',
      version: '1.0.0',
      environment: config.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
    message: 'Welcome to the Hardwood Species Selector API',
  });
});

// Health check at root level
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
    },
    message: 'Server is healthy',
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(config.PORT, () => {
  console.log(`
🚀 Hardwood Species Selector API Server Started
📍 Environment: ${config.NODE_ENV}
🌐 Port: ${config.PORT}
🔗 URL: http://localhost:${config.PORT}
📚 API: http://localhost:${config.PORT}/api
🏥 Health: http://localhost:${config.PORT}/health
⏰ Started: ${new Date().toISOString()}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;