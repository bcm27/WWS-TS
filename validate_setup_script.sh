#!/bin/bash

# Validation script for Hardwood Species Selector
# This script validates that the project structure is correct after setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED_CHECKS++))
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED_CHECKS++))
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

check_file() {
    local file=$1
    local description=$2
    ((TOTAL_CHECKS++))
    
    if [ -f "$file" ]; then
        print_status "$description: $file"
    else
        print_error "$description: $file (missing)"
    fi
}

check_dir() {
    local dir=$1
    local description=$2
    ((TOTAL_CHECKS++))
    
    if [ -d "$dir" ]; then
        print_status "$description: $dir"
    else
        print_error "$description: $dir (missing)"
    fi
}

check_executable() {
    local file=$1
    local description=$2
    ((TOTAL_CHECKS++))
    
    if [ -f "$file" ] && [ -x "$file" ]; then
        print_status "$description: $file"
    else
        print_error "$description: $file (missing or not executable)"
    fi
}

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}🌳 Hardwood Species Selector - Validation${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

print_info "Validating project structure..."
echo ""

# Root directory checks
print_info "Root Directory Files:"
check_file "package.json" "Root package.json"
check_file "README.md" "Documentation"
check_file "docker-compose.yml" "Development Docker Compose"
check_file "docker-compose.prod.yml" "Production Docker Compose"
check_file ".gitignore" "Git ignore file"
check_file ".env.example" "Environment template"
check_file "Makefile" "Makefile"
check_file "DEVELOPMENT.md" "Development guide"

echo ""

# Executable scripts
print_info "Executable Scripts:"
check_executable "setup-project.sh" "Setup script"
check_executable "start-dev.sh" "Development start script"
check_executable "deploy-prod.sh" "Production deployment script"
check_executable "quick-start.sh" "Quick start script"
check_executable "build.sh" "Build script"

echo ""

# Backend structure
print_info "Backend Structure:"
check_dir "backend" "Backend directory"
check_dir "backend/src" "Backend source directory"
check_dir "backend/src/controllers" "Controllers directory"
check_dir "backend/src/middleware" "Middleware directory"
check_dir "backend/src/routes" "Routes directory"
check_dir "backend/src/services" "Services directory"
check_dir "backend/src/types" "Types directory"
check_dir "backend/src/utils" "Utils directory"
check_dir "backend/database" "Database directory"
check_dir "backend/tests" "Backend tests directory"

echo ""

# Backend files
print_info "Backend Files:"
check_file "backend/package.json" "Backend package.json"
check_file "backend/tsconfig.json" "Backend TypeScript config"
check_file "backend/Dockerfile" "Backend Dockerfile"
check_file "backend/.env.example" "Backend environment template"
check_file "backend/src/app.ts" "Main application file"
check_file "backend/src/types/index.ts" "Type definitions"
check_file "backend/src/utils/config.ts" "Configuration utils"
check_file "backend/src/utils/database.ts" "Database utils"
check_file "backend/src/services/speciesService.ts" "Species service"
check_file "backend/src/middleware/index.ts" "Middleware definitions"
check_file "backend/src/controllers/speciesController.ts" "Species controller"
check_file "backend/src/routes/index.ts" "Route definitions"
check_file "backend/database/schema.sql" "Database schema"
check_file "backend/database/seed.sql" "Database seed data"

echo ""

# Frontend structure
print_info "Frontend Structure:"
check_dir "frontend" "Frontend directory"
check_dir "frontend/src" "Frontend source directory"
check_dir "frontend/src/components" "Components directory"
check_dir "frontend/src/pages" "Pages directory"
check_dir "frontend/src/hooks" "Hooks directory"
check_dir "frontend/src/services" "Services directory"
check_dir "frontend/src/types" "Types directory"
check_dir "frontend/src/utils" "Utils directory"
check_dir "frontend/public" "Public directory"

echo ""

# Frontend files
print_info "Frontend Configuration Files:"
check_file "frontend/package.json" "Frontend package.json"
check_file "frontend/tsconfig.json" "Frontend TypeScript config"
check_file "frontend/tsconfig.node.json" "Node TypeScript config"
check_file "frontend/vite.config.ts" "Vite configuration"
check_file "frontend/tailwind.config.js" "Tailwind configuration"
check_file "frontend/postcss.config.js" "PostCSS configuration"
check_file "frontend/Dockerfile" "Frontend Dockerfile"
check_file "frontend/nginx.conf" "Nginx configuration"
check_file "frontend/index.html" "HTML entry point"

echo ""

print_info "Frontend Source Files:"
check_file "frontend/src/main.tsx" "Application entry point"
check_file "frontend/src/App.tsx" "Main App component"
check_file "frontend/src/index.css" "Global styles"
check_file "frontend/src/types/index.ts" "Type definitions"
check_file "frontend/src/utils/index.ts" "Utility functions"
check_file "frontend/src/utils/localStorage.ts" "Local storage utils"
check_file "frontend/src/services/api.ts" "API service"

echo ""

print_info "Frontend Hooks:"
check_file "frontend/src/hooks/useFavorites.ts" "Favorites hook"
check_file "frontend/src/hooks/useSpecies.ts" "Species hook"

echo ""

print_info "Frontend Components:"
check_file "frontend/src/components/WoodTypeSelector.tsx" "Wood type selector"
check_file "frontend/src/components/SearchBar.tsx" "Search bar component"
check_file "frontend/src/components/SpeciesTable.tsx" "Species table component"
check_file "frontend/src/components/FavoritesList.tsx" "Favorites list component"
check_file "frontend/src/components/ErrorBoundary.tsx" "Error boundary component"
check_file "frontend/src/components/LoadingSpinner.tsx" "Loading spinner component"

echo ""

print_info "Frontend Pages:"
check_file "frontend/src/pages/Home.tsx" "Home page"
check_file "frontend/src/pages/Favorites.tsx" "Favorites page"

echo ""

# Validate package.json files
print_info "Validating package.json files..."

if [ -f "package.json" ]; then
    if command -v node &> /dev/null; then
        if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
            print_status "Root package.json is valid JSON"
            ((TOTAL_CHECKS++))
            ((PASSED_CHECKS++))
        else
            print_error "Root package.json has invalid JSON"
            ((TOTAL_CHECKS++))
        fi
    fi
fi

if [ -f "backend/package.json" ]; then
    if command -v node &> /dev/null; then
        if node -e "JSON.parse(require('fs').readFileSync('backend/package.json', 'utf8'))" 2>/dev/null; then
            print_status "Backend package.json is valid JSON"
            ((TOTAL_CHECKS++))
            ((PASSED_CHECKS++))
        else
            print_error "Backend package.json has invalid JSON"
            ((TOTAL_CHECKS++))
        fi
    fi
fi

if [ -f "frontend/package.json" ]; then
    if command -v node &> /dev/null; then
        if node -e "JSON.parse(require('fs').readFileSync('frontend/package.json', 'utf8'))" 2>/dev/null; then
            print_status "Frontend package.json is valid JSON"
            ((TOTAL_CHECKS++))
            ((PASSED_CHECKS++))
        else
            print_error "Frontend package.json has invalid JSON"
            ((TOTAL_CHECKS++))
        fi
    fi
fi

echo ""

# Check for common issues
print_info "Checking for common issues..."

# Check if any original artifact files remain
if ls *_*.* 2>/dev/null | grep -E "(backend_|frontend_|root_)" >/dev/null; then
    print_warning "Original artifact files still present. You may want to clean these up."
    ls *_*.* 2>/dev/null | grep -E "(backend_|frontend_|root_)" | head -5
    echo "   (showing first 5, there may be more...)"
else
    print_status "No leftover artifact files found"
    ((TOTAL_CHECKS++))
    ((PASSED_CHECKS++))
fi

# Check file permissions on scripts
scripts=("setup-project.sh" "start-dev.sh" "deploy-prod.sh" "quick-start.sh" "build.sh")
for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            print_status "$script is executable"
        else
            print_warning "$script is not executable (run: chmod +x $script)"
        fi
    fi
done

echo ""
echo "================================================"
echo -e "${BLUE}Validation Summary${NC}"
echo "================================================"
echo "Total checks: $TOTAL_CHECKS"
echo -e "Passed: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Failed: ${RED}$FAILED_CHECKS${NC}"

if [ $FAILED_CHECKS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All validation checks passed!${NC}"
    echo ""
    echo -e "${GREEN}✅ Your project structure is correct${NC}"
    echo -e "${BLUE}🚀 Ready to start development${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run: ./quick-start.sh"
    echo "  2. Open: http://localhost"
    echo "  3. Start coding! 🎯"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Validation failed with $FAILED_CHECKS errors${NC}"
    echo ""
    echo "Please fix the issues above and run validation again."
    echo "You may need to re-run the setup script: ./setup-project.sh"
    exit 1
fi