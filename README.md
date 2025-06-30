# Hardwood Species Selector

A professional web application for selecting and managing hardwood species with filtering capabilities, sortable columns, and favorites management. Built with TypeScript, React, Express.js, and PostgreSQL.

## 🌳 Features

### Core Functionality
- **Wood Type Selection**: Browse domestic, exotic, and plywood species
- **Sortable Table**: Click column headers to sort by any field
- **Search & Filter**: Real-time search across all species data
- **Favorites Management**: Save up to 32 favorite species with persistent storage
- **Responsive Design**: Optimized for desktop and mobile devices
- **Export/Import**: Backup and share favorite collections

### Technical Features
- **Full TypeScript**: Type-safe frontend and backend
- **RESTful API**: Clean, documented API endpoints
- **Real-time Search**: Debounced search with instant results
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Optimized queries and caching
- **Security**: Rate limiting, input validation, and CORS protection

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 14+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WWS-TS
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Local Development

1. **Database Setup**
   ```bash
   # Start PostgreSQL
   createdb hardwood_selector
   psql -d hardwood_selector -f backend/database/schema.sql
   psql -d hardwood_selector -f backend/database/seed.sql
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📊 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/domestic` | Get domestic wood species |
| GET | `/api/exotic` | Get exotic wood species |
| GET | `/api/plywood` | Get plywood species |
| GET | `/api/species/:type` | Get species by type |
| GET | `/api/search?q=term` | Search across all species |
| GET | `/api/wood-types` | Get available wood types with counts |
| GET | `/api/health` | Health check endpoint |

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "species": "Red Oak",
      "size": "4/4",
      "price": 4.50,
      "grade": "Select",
      "vendor": "Northern Timber Co"
    }
  ],
  "count": 1,
  "message": "Found 1 domestic wood species"
}
```

## 🗄️ Database Schema

### Wood Species Table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| species | VARCHAR(100) | Species name (required) |
| size | VARCHAR(20) | Size in quarters (required) |
| price | DECIMAL(10,2) | Price per board foot (required) |
| grade | VARCHAR(50) | Grade classification (optional) |
| vendor | VARCHAR(100) | Vendor name (required) |
| wood_type | ENUM | Type: domestic, exotic, plywood |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## 🛠️ Development

### Project Structure

```
WWS-TS/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # Route definitions
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── database/
│   │   ├── schema.sql       # Database schema
│   │   └── seed.sql         # Sample data
│   └── tests/               # Test files
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
├── docker-compose.yml       # Development setup
├── docker-compose.prod.yml  # Production setup
└── README.md               # This file
```

### Available Scripts

#### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run db:setup     # Setup database schema
npm run db:seed      # Seed database with sample data
```

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
```

### Environment Variables

#### Backend (.env)
```bash
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hardwood_selector
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
vim .env

# Start production stack
docker-compose -f docker-compose.prod.yml up -d
```

### Docker Services
- **database**: PostgreSQL with initialized schema and data
- **backend**: Node.js API server
- **frontend**: React app served by Nginx
- **nginx-proxy**: Optional reverse proxy for SSL termination
- **redis**: Optional cache layer

## 🔧 Configuration

### Database Configuration
The application uses PostgreSQL with the following key features:
- Automatic schema initialization
- Sample data seeding
- Indexed columns for performance
- Full-text search capabilities

### API Configuration
- Rate limiting (100 requests per 15 minutes by default)
- CORS enabled for specified origins
- Request/response logging
- Error handling with appropriate HTTP status codes

### Frontend Configuration
- Vite build system for fast development
- Tailwind CSS for styling
- React Router for navigation
- Local storage for favorites persistence

## 📱 User Guide

### Getting Started
1. **Select a Wood Type**: Choose from domestic, exotic, or plywood
2. **Browse Species**: View the complete list with prices and details
3. **Search**: Use the search bar to find specific species, vendors, or grades
4. **Sort**: Click column headers to sort by any field
5. **Add Favorites**: Click the heart icon to save species (max 32)
6. **Manage Favorites**: Visit the favorites page to organize your collection

### Features Guide

#### Search Functionality
- Search across species names, vendors, grades, and prices
- Real-time results with debounced input
- Minimum 2 characters required
- Quick search suggestions available

#### Favorites System
- Maximum 32 favorites allowed
- Persistent storage in browser
- Export/import functionality for backup
- Organized by wood type and date added

#### Table Sorting
- Click any column header to sort
- Click again to reverse sort direction
- Visual indicators show current sort status
- Maintains sort state during search

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run all tests
npm run test:ui             # Interactive test UI
npm run test:coverage       # Coverage report
```

### Integration Tests
```bash
# Start test environment
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
npm run test:integration
```

## 🔐 Security

### Implemented Security Measures
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection with proper output encoding
- CORS configuration for trusted origins
- Rate limiting to prevent abuse
- Security headers (HSTS, CSP, etc.)
- Docker security with non-root users

### Security Headers
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` with appropriate directives

## 🚀 Performance

### Optimization Features
- Database indexing for fast queries
- Gzip compression for static assets
- Efficient React rendering with proper keys
- Debounced search to reduce API calls
- Lazy loading for large datasets
- Browser caching for static resources

### Performance Metrics
- Initial page load: < 2 seconds
- Search response time: < 200ms
- Database query optimization with indexes
- Bundle size optimization with code splitting

## 🔄 CI/CD

### GitHub Actions (Example)
```yaml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration enforced
- Prettier for code formatting
- Conventional commit messages
- 100% test coverage for critical paths

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

### Getting Help
- Check the [Issues](../../issues) page for known problems
- Create a new issue for bugs or feature requests
- Review the API documentation for endpoint details
- Check Docker logs for debugging: `docker-compose logs -f`

### Common Issues

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps database

# View database logs
docker-compose logs database

# Reset database
docker-compose down -v
docker-compose up -d
```

#### Build Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

## 🔮 Roadmap

### Planned Features
- [ ] User authentication and profiles
- [ ] Advanced filtering options
- [ ] Price history tracking
- [ ] Vendor management system
- [ ] Mobile app (React Native)
- [ ] API rate limiting per user
- [ ] Advanced analytics dashboard
- [ ] Bulk import/export functionality

### Version History
- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added favorites management
- **v1.2.0** - Enhanced search and filtering
- **v2.0.0** - Complete TypeScript rewrite (current)

---

Built with ❤️ using TypeScript, React, Express.js, and PostgreSQL.