# Stop everything and clean up
docker-compose -f docker/docker-compose.yml down
docker system prune -f

# Remove backend build cache to force rebuild
docker rmi $(docker images -q hardwood-backend 2>/dev/null) 2>/dev/null || true
docker rmi $(docker images -q hardwood-db 2>/dev/null) 2>/dev/null || true

# Rebuild everything from scratch
docker-compose -f docker/docker-compose.yml build --no-cache

# Start services
docker-compose -f docker/docker-compose.yml up -d