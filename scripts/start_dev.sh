#!/bin/bash

# Development startup script for Hardwood Species Selector

echo "Starting Hardwood Species Selector in development mode..."

if [ "$DEVCONTAINER" = "true" ]; then
    echo "Running in VS Code dev container mode..."
    # Install dependencies if not present
    if [ ! -d "node_modules" ]; then
        npm run install:all
    fi
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

echo "Starting services with Docker Compose..."
docker-compose -f docker/docker-compose.yml up -d

echo "Waiting for services to be ready..."
sleep 10

# Check service health
echo "Checking service status..."
docker-compose -f docker/docker-compose.yml ps

echo ""
echo "Development environment is ready!"
echo ""
echo "   Access the application:"
echo "   Frontend: http://127.0.0.1:5173/"
echo "   Backend API: http://127.0.001:5173"
echo "   Database: localhost:5432"
echo ""
echo "   Useful commands:"
echo "   View logs: docker-compose -f docker/docker-compose.yml logs -f"
echo "   Stop services: docker-compose -f docker/docker-compose.yml down"
echo "   Restart: docker-compose -f docker/docker-compose.yml restart"
echo "   Clean restart: docker-compose -f docker/docker-compose.yml down -v && docker-compose -f docker/docker-compose.yml up -d"
echo ""