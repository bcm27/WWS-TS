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
