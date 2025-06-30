# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hardwood_selector
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# For production, consider these additional settings:
# DB_SSL=true
# CORS_ORIGIN=https://yourdomain.com
# RATE_LIMIT_WINDOW_MS=900000
# RATE_LIMIT_MAX_REQUESTS=50