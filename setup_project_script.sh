#!/bin/bash

# Hardwood Species Selector - Project Setup Script
# This script organizes files into proper directory structure and creates build scripts

set -e  # Exit on any error

echo "🌳 Setting up Hardwood Species Selector project structure..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "backend_package.json" ]; then
    print_error "Error: backend_package.json not found. Make sure you're in the correct directory."
    exit 1
fi

print_info "Creating directory structure..."

# Create backend directories
mkdir -p backend/src/{controllers,middleware,routes,services,types,utils}
mkdir -p backend/database
mkdir -p backend/tests

# Create frontend directories
mkdir -p frontend/src/{components,pages,hooks,services,types,utils}
mkdir -p frontend/public

print_status "Directory structure created"

print_info "Moving and renaming backend files..."

# Backend files
mv backend_package.json backend/package.json
mv backend_tsconfig.json backend/tsconfig.json
mv backend_dockerfile.txt backend/Dockerfile
mv backend_env_example.sh backend/.env.example

# Backend source files
mv backend_app.ts backend/src/app.ts
mv backend_types.ts backend/src/types/index.ts
mv backend_config.ts backend/src/utils/config.ts
mv backend_database_config.ts backend/src/utils/database.ts
mv backend_species_service.ts backend/src/services/speciesService.ts
mv backend_middleware.ts backend/src/middleware/index.ts
mv backend_species_controller.ts backend/src/controllers/speciesController.ts
mv backend_routes.ts backend/src/routes/index.ts

# Backend database files
mv backend_database_schema.sql backend/database/schema.sql
mv backend_database_seed.sql backend/database/seed.sql

print_status "Backend files moved"

print_info "Moving and renaming frontend files..."

# Frontend files
mv frontend_package.json frontend/package.json
mv frontend_tsconfig.json frontend/tsconfig.json
mv frontend_tsconfig_node.json frontend/tsconfig.node.json
mv frontend_vite_config.ts frontend/vite.config.ts
mv frontend_tailwind_config.js frontend/tailwind.config.js
mv frontend_postcss_config.js frontend/postcss.config.js
mv frontend_dockerfile.txt frontend/Dockerfile
mv frontend_nginx_config.txt frontend/nginx.conf

# Frontend source files
mv frontend_main.ts frontend/src/main.tsx
mv frontend_app_component.ts frontend/src/App.tsx
mv frontend_css.css frontend/src/index.css
mv frontend_types.ts frontend/src/types/index.ts
mv frontend_utils.ts frontend/src/utils/index.ts
mv frontend_local_storage.ts frontend/src/utils/localStorage.ts
mv frontend_api_service.ts frontend/src/services/api.ts

# Frontend hooks
mv frontend_use_favorites_hook.ts frontend/src/hooks/useFavorites.ts
mv frontend_use_species_hook.ts frontend/src/hooks/useSpecies.ts

# Frontend components
mv frontend_wood_type_selector.ts frontend/src/components/WoodTypeSelector.tsx
mv frontend_search_bar.ts frontend/src/components/SearchBar.tsx
mv frontend_species_table.ts frontend/src/components/SpeciesTable.tsx
mv frontend_favorites_list.ts frontend/src/components/FavoritesList.tsx
mv frontend_error_boundary.ts frontend/src/components/ErrorBoundary.tsx
mv frontend_loading_spinner.ts frontend/src/components/LoadingSpinner.tsx

# Frontend pages
mv frontend_home_page.ts frontend/src/pages/Home.tsx
mv frontend_favorites_page.ts frontend/src/pages/Favorites.tsx

# Frontend public files
mv frontend_index_html.html frontend/index.html

print_status "Frontend files moved"

print_info "Moving root files..."

# Root files
mv root_docker_compose.txt docker-compose.yml
mv root_docker_compose_prod.txt docker-compose.prod.yml
mv root_gitignore.txt .gitignore
mv root_readme.txt README.md

print_status "Root files moved"

print_info "Creating build and development scripts..."

# Create package.json for root directory
cat > package.json << 'EOF'
{
  "name": "hardwood-species-selector",
  "version": "1.0.0",
  "description": "Professional hardwood species selector application",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev": "docker-compose up -d",
    "dev:logs": "docker-compose logs -f",
    "dev:stop": "docker-compose down",
    "dev:clean": "docker-compose down -v && docker system prune -f",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && npm test",
    "test:frontend": "cd frontend && npm test",
    "prod": "docker-compose -f docker-compose.prod.yml up -d",
    "prod:stop": "docker-compose -f docker-compose.prod.yml down",
    "db:setup": "cd backend && npm run db:setup",
    "db:seed": "cd backend && npm run db:seed",
    "lint": "npm run lint:backend && npm run lint:frontend",
    "lint:backend": "cd backend && npm run lint",
    "lint:frontend": "cd frontend && npm run lint",
    "start": "npm run prod"
  },
  "keywords": [
    "hardwood",
    "lumber",
    "wood-species",
    "typescript",
    "react",
    "express"
  ],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

print_status "Root package.json created"

# Create development script
cat > start-dev.sh << 'EOF'
#!/bin/bash

# Development startup script for Hardwood Species Selector

echo "🌳 Starting Hardwood Species Selector in development mode..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install docker-compose."
    exit 1
fi

echo "🐳 Starting services with Docker Compose..."
docker-compose up -d

echo "📊 Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "✅ Development environment is ready!"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3001"
echo "   Database: localhost:5432"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Clean restart: docker-compose down -v && docker-compose up -d"
echo ""
EOF

chmod +x start-dev.sh

# Create production deployment script
cat > deploy-prod.sh << 'EOF'
#!/bin/bash

# Production deployment script for Hardwood Species Selector

echo "🚀 Deploying Hardwood Species Selector to production..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file from template..."
    cp backend/.env.example .env
    echo "📝 Please edit .env file with your production settings before continuing."
    echo "❌ Deployment stopped. Configure .env file first."
    exit 1
fi

echo "🐳 Building and starting production services..."
docker-compose -f docker-compose.prod.yml up -d --build

echo "📊 Waiting for services to be ready..."
sleep 15

# Check service health
echo "🔍 Checking service status..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Production deployment complete!"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost (or your domain)"
echo "   Backend API: http://localhost:3001"
echo ""
echo "📋 Management commands:"
echo "   View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose.prod.yml down"
echo "   Update: git pull && docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
EOF

chmod +x deploy-prod.sh

# Create quick setup script
cat > quick-start.sh << 'EOF'
#!/bin/bash

# Quick start script for Hardwood Species Selector

echo "🌳 Hardwood Species Selector - Quick Start"
echo "========================================"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ All prerequisites met!"
echo ""

echo "🚀 Starting the application..."
./start-dev.sh

echo ""
echo "🎉 Setup complete! Your Hardwood Species Selector is now running."
echo ""
echo "🌐 Open your browser and go to: http://localhost"
echo ""
echo "📚 For more information, see README.md"
EOF

chmod +x quick-start.sh

print_status "Build and deployment scripts created"

# Create a simple makefile for convenience
cat > Makefile << 'EOF'
.PHONY: help dev prod build test clean install lint

help: ## Show this help message
	@echo "Hardwood Species Selector - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	@./start-dev.sh

prod: ## Deploy to production
	@./deploy-prod.sh

build: ## Build the application
	@npm run build

test: ## Run tests
	@npm run test

clean: ## Clean up Docker containers and volumes
	@docker-compose down -v
	@docker system prune -f

install: ## Install all dependencies
	@npm run install:all

lint: ## Run linting
	@npm run lint

logs: ## View application logs
	@docker-compose logs -f

status: ## Check service status
	@docker-compose ps

restart: ## Restart services
	@docker-compose restart

stop: ## Stop all services
	@docker-compose down

quick-start: ## Quick start for new users
	@./quick-start.sh
EOF

print_status "Makefile created"

# Create .env.example for root
cat > .env.example << 'EOF'
# Production Environment Variables for Hardwood Species Selector

# Database Configuration
DB_NAME=hardwood_selector
DB_USER=postgres
DB_PASSWORD=your-secure-password-here
DB_SSL=false

# Application Configuration
CORS_ORIGIN=https://yourdomain.com
FRONTEND_PORT=80

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# Optional: Redis Configuration (if using cache profile)
REDIS_PASSWORD=your-redis-password-here

# Optional: SSL Configuration (if using proxy profile)
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem
EOF

print_status "Environment configuration created"

print_info "Setting up Git repository..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    print_status "Git repository initialized"
else
    print_info "Git repository already exists"
fi

# Create initial commit if no commits exist
if ! git rev-parse HEAD > /dev/null 2>&1; then
    git add .
    git commit -m "Initial commit: Hardwood Species Selector application

- Complete TypeScript implementation
- React frontend with Tailwind CSS
- Express.js backend with PostgreSQL
- Docker containerization
- Favorites management system
- Responsive design
- Real-time search and filtering"
    print_status "Initial commit created"
fi

print_info "Creating helpful documentation..."

# Create DEVELOPMENT.md
cat > DEVELOPMENT.md << 'EOF'
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
EOF

print_status "Development documentation created"

echo ""
echo "🎉 Project setup complete!"
echo ""
echo -e "${GREEN}✅ Directory Structure:${NC}"
echo "   📁 backend/          - Express.js API server"
echo "   📁 frontend/         - React application"
echo "   📁 backend/database/ - SQL schema and seed data"
echo "   🐳 docker-compose.yml - Development environment"
echo "   🚀 docker-compose.prod.yml - Production environment"
echo ""
echo -e "${GREEN}✅ Scripts Created:${NC}"
echo "   🚀 quick-start.sh    - One-command setup"
echo "   🔧 start-dev.sh      - Development environment"
echo "   🌐 deploy-prod.sh    - Production deployment"
echo "   📋 Makefile          - Convenient commands"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "   1. Run: ${YELLOW}./quick-start.sh${NC}"
echo "   2. Open: ${YELLOW}http://localhost${NC}"
echo "   3. Start coding! 🎯"
echo ""
echo -e "${GREEN}📚 Helpful Commands:${NC}"
echo "   ${YELLOW}make help${NC}        - Show all available commands"
echo "   ${YELLOW}make dev${NC}         - Start development environment"
echo "   ${YELLOW}make logs${NC}        - View application logs"
echo "   ${YELLOW}make test${NC}        - Run all tests"
echo "   ${YELLOW}make clean${NC}       - Clean up containers"
echo ""
echo -e "${GREEN}📖 Documentation:${NC}"
echo "   📄 README.md         - Main documentation"
echo "   🔧 DEVELOPMENT.md    - Development guide"
echo "   ⚙️  .env.example      - Environment configuration"
echo ""
echo "Happy coding! 🌳✨"