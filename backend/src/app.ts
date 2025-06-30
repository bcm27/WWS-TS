import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './utils/config';
import { initializeDatabase } from './utils/database';
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

async function startServer() {
  try {
    console.log('='.repeat(50));
    console.log('Starting Hardwood Species Selector API Server');
    console.log('='.repeat(50));
    
    // CRITICAL: Initialize database connection FIRST and wait for it
    console.log('Initializing database connection...');
    console.log(`   Host: ${config.DB_HOST}:${config.DB_PORT}`);
    console.log(`   Database: ${config.DB_NAME}`);
    console.log(`   User: ${config.DB_USER}`);
    
    await initializeDatabase(config);
    console.log('Database connection established successfully');

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

    // NOW load routes after database is ready
    console.log('Loading API routes...');
    const routes = require('./routes').default;
    app.use('/api', routes);
    console.log('API routes loaded successfully');

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
      console.log('Server Started Successfully!');
      console.log(`   Environment: ${config.NODE_ENV}`);
      console.log(`   Port: ${config.PORT}`);
      console.log(`   URL: http://localhost:${config.PORT}`);
      console.log(`   API: http://localhost:${config.PORT}/api`);
      console.log(`   Health: http://localhost:${config.PORT}/health`);
      console.log(`   Started: ${new Date().toISOString()}`);
      console.log('='.repeat(50));
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'Unknown error');
    process.exit(1);
  }
}

// Start the server
startServer();