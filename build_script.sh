#!/bin/bash

# Build script for Hardwood Species Selector
# This script builds both frontend and backend for production

set -e  # Exit on any error

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

print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}🌳 Hardwood Species Selector - Build Script${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

print_header

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Error: Not in project root directory or project not properly set up."
    print_error "Make sure you've run the setup script first: ./setup-project.sh"
    exit 1
fi

# Parse command line arguments
BUILD_TYPE="all"
SKIP_DEPS=false
CLEAN_BUILD=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-only)
            BUILD_TYPE="backend"
            shift
            ;;
        --frontend-only)
            BUILD_TYPE="frontend"
            shift
            ;;
        --skip-deps)
            SKIP_DEPS=true
            shift
            ;;
        --clean)
            CLEAN_BUILD=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --backend-only   Build only the backend"
            echo "  --frontend-only  Build only the frontend"
            echo "  --skip-deps      Skip dependency installation"
            echo "  --clean          Clean build (remove existing build directories)"
            echo "  --verbose        Verbose output"
            echo "  --help, -h       Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                    # Build everything"
            echo "  $0 --backend-only     # Build only backend"
            echo "  $0 --clean            # Clean build"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            print_info "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Set verbose mode
if [ "$VERBOSE" = true ]; then
    set -x
fi

print_info "Build configuration:"
echo "   Build type: $BUILD_TYPE"
echo "   Skip dependencies: $SKIP_DEPS"
echo "   Clean build: $CLEAN_BUILD"
echo "   Verbose: $VERBOSE"
echo ""

# Function to check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        print_info "Visit: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | sed 's/v//')
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1)
    
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18 or later."
        exit 1
    fi
    
    print_status "Node.js version: $NODE_VERSION"
}

# Function to check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NPM_VERSION=$(npm -v)
    print_status "npm version: $NPM_VERSION"
}

# Function to install dependencies
install_dependencies() {
    if [ "$SKIP_DEPS" = true ]; then
        print_warning "Skipping dependency installation"
        return
    fi
    
    print_info "Installing dependencies..."
    
    # Install root dependencies
    print_info "Installing root dependencies..."
    npm install
    
    if [ "$BUILD_TYPE" = "all" ] || [ "$BUILD_TYPE" = "backend" ]; then
        print_info "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
    fi
    
    if [ "$BUILD_TYPE" = "all" ] || [ "$BUILD_TYPE" = "frontend" ]; then
        print_info "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
    fi
    
    print_status "Dependencies installed"
}

# Function to clean build directories
clean_build_dirs() {
    if [ "$CLEAN_BUILD" = false ]; then
        return
    fi
    
    print_info "Cleaning build directories..."
    
    if [ "$BUILD_TYPE" = "all" ] || [ "$BUILD_TYPE" = "backend" ]; then
        rm -rf backend/dist
        print_status "Backend build directory cleaned"
    fi
    
    if [ "$BUILD_TYPE" = "all" ] || [ "$BUILD_TYPE" = "frontend" ]; then
        rm -rf frontend/dist
        print_status "Frontend build directory cleaned"
    fi
}

# Function to build backend
build_backend() {
    print_info "Building backend..."
    
    cd backend
    
    # Run linting
    print_info "Running backend linting..."
    if npm run lint > /dev/null 2>&1; then
        print_status "Backend linting passed"
    else
        print_warning "Backend linting issues found (continuing anyway)"
    fi
    
    # Build TypeScript
    print_info "Compiling TypeScript..."
    npm run build
    
    print_status "Backend build completed"
    print_info "Backend built to: backend/dist/"
    
    cd ..
}

# Function to build frontend
build_frontend() {
    print_info "Building frontend..."
    
    cd frontend
    
    # Run linting
    print_info "Running frontend linting..."
    if npm run lint > /dev/null 2>&1; then
        print_status "Frontend linting passed"
    else
        print_warning "Frontend linting issues found (continuing anyway)"
    fi
    
    # Build React app
    print_info "Building React application..."
    npm run build
    
    print_status "Frontend build completed"
    print_info "Frontend built to: frontend/dist/"
    
    cd ..
}

# Function to run tests
run_tests() {
    print_info "Running tests..."
    
    if [ "$BUILD_TYPE" = "all" ] || [ "$BUILD_TYPE" = "backend" ]; then
        print_info "Running backend tests..."
        cd backend
        if npm test > /dev/null 2>&1; then
            print_status "Backend tests passed"
        else
            print_warning "Backend tests failed (continuing anyway)"
        fi
        cd ..
    fi
    
    if [ "$BUILD_TYPE" = "all" ] || [ "$BUILD_TYPE" = "frontend" ]; then
        print_info "Running frontend tests..."
        cd frontend
        if npm test -- --run > /dev/null 2>&1; then
            print_status "Frontend tests passed"
        else
            print_warning "Frontend tests failed (continuing anyway)"
        fi
        cd ..
    fi
}

# Function to show build summary
show_summary() {
    echo ""
    print_info "Build Summary:"
    echo "=============="
    
    if [ "$BUILD_TYPE" = "all" ] || [ "$BUILD_TYPE" = "backend" ]; then
        if [ -d "backend/dist" ]; then
            BACKEND_SIZE=$(du -sh backend/dist 2>/dev/null | cut -f1 || echo "Unknown")
            echo "   ✅ Backend: backend/dist/ ($BACKEND_SIZE)"
        else
            echo "   ❌ Backend: Build failed"
        fi
    fi
    
    if [ "$BUILD_TYPE" = "all" ] || [ "$BUILD_TYPE" = "frontend" ]; then
        if [ -d "frontend/dist" ]; then
            FRONTEND_SIZE=$(du -sh frontend/dist 2>/dev/null | cut -f1 || echo "Unknown")
            echo "   ✅ Frontend: frontend/dist/ ($FRONTEND_SIZE)"
        else
            echo "   ❌ Frontend: Build failed"
        fi
    fi
    
    echo ""
    print_info "Next steps:"
    echo "   🐳 Build Docker images: docker-compose build"
    echo "   🚀 Deploy to production: ./deploy-prod.sh"
    echo "   🧪 Test locally: ./start-dev.sh"
}

# Main build process
main() {
    local start_time=$(date +%s)
    
    print_info "Starting build process..."
    
    # Checks
    check_node
    check_npm
    
    # Clean if requested
    clean_build_dirs
    
    # Install dependencies
    install_dependencies
    
    # Build components
    if [ "$BUILD_TYPE" = "all" ] || [ "$BUILD_TYPE" = "backend" ]; then
        build_backend
    fi
    
    if [ "$BUILD_TYPE" = "all" ] || [ "$BUILD_TYPE" = "frontend" ]; then
        build_frontend
    fi
    
    # Run tests
    run_tests
    
    # Calculate build time
    local end_time=$(date +%s)
    local build_time=$((end_time - start_time))
    
    print_status "Build completed successfully in ${build_time} seconds! 🎉"
    
    # Show summary
    show_summary
}

# Error handling
trap 'print_error "Build failed! Check the output above for details."; exit 1' ERR

# Run main function
main "$@"