#!/bin/bash

# Production deployment script for Hardwood Species Selector

echo "Deploying Hardwood Species Selector to production..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp backend/.env.example .env
    echo "Please edit .env file with your production settings before continuing."
    echo "Deployment stopped. Configure .env file first."
    exit 1
fi

# Check if production docker-compose file exists
if [ ! -f "docker/docker-compose.prod.yml" ]; then
    echo "docker/docker-compose.prod.yml not found."
    echo "Creating production compose file from development template..."
    cp docker/docker-compose.yml docker/docker-compose.prod.yml
    echo "Please customize docker/docker-compose.prod.yml for production settings."
    echo "Deployment stopped. Configure production compose file first."
    exit 1
fi

echo "Building and starting production services..."
docker-compose -f docker/docker-compose.prod.yml up -d --build

echo "Waiting for services to be ready..."
sleep 15

# Check service health
echo "Checking service status..."
docker-compose -f docker/docker-compose.prod.yml ps

echo ""
echo "Production deployment complete!"
echo ""
echo "   Access the application:"
echo "   Frontend: http://localhost (or your domain)"
echo "   Backend API: http://localhost:3001"
echo ""
echo "   Management commands:"
echo "   View logs: docker-compose -f docker/docker-compose.prod.yml logs -f"
echo "   Stop services: docker-compose -f docker/docker-compose.prod.yml down"
echo "   Update: git pull && docker-compose -f docker/docker-compose.prod.yml up -d --build"
echo ""