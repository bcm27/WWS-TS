# Development Guide

## Quick Start

```bash
# Start development environment
make dev
# or
./start-dev.sh

# View logs
make logs

# Stop services
make stop
```

## Manual Setup

1. **Install dependencies:**
   ```bash
   make install
   ```

2. **Start services:**
   ```bash
   make dev
   ```

3. **Access the application:**
   - Frontend: http://localhost
   - Backend: http://localhost:3001
   - Database: localhost:5432

## Development Workflow

### Backend Development
```bash
cd backend
npm run dev  # Start with hot reloading
npm test     # Run tests
npm run lint # Check code quality
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start development server
npm test     # Run tests
npm run lint # Check code quality
```

### Database Management
```bash
# Reset database
make clean
make dev

# Manual database setup
make db:setup
make db:seed
```

## Testing

```bash
# Run all tests
make test

# Run specific tests
cd backend && npm test
cd frontend && npm test
```

## Building for Production

```bash
# Build all components
make build

# Deploy to production
make prod
```
