# Backend Dockerfile for Hardwood Species Selector

# Build stage
FROM node:18-alpine AS builder

# Install bash and postgresql-client for wait script
RUN apk add --no-cache bash postgresql-client

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install bash and postgresql-client for wait script
RUN apk add --no-cache bash postgresql-client curl

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/database ./database
COPY --from=builder /app/scripts ./scripts

# Make wait script executable
RUN chmod +x scripts/wait-for-db.sh

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=5 \
    CMD curl -f http://localhost:3001/health || exit 1

# Use wait script before starting the application
CMD ["./scripts/wait-for-db.sh", "database", "5432", "hardwood_selector", "postgres", "password", "node", "dist/app.js"]