# Hardwood Species Selector

A TypeScript web application for browsing and managing hardwood species with filtering, sorting, and favorites functionality.

## Quick Start

**Prerequisites:** Docker & Docker Compose

```bash
# Start development environment
docker-compose -f docker/docker-compose.yml up -d

# Or use the Makefile
make dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Database: localhost:5432

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL
- **Deployment:** Docker + Docker Compose

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/domestic` | Get domestic wood species |
| GET | `/api/exotic` | Get exotic wood species |
| GET | `/api/plywood` | Get plywood species |
| GET | `/api/search?q=term` | Search across all species |
| GET | `/api/health` | Health check |

## Development

### Local Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend  
cd frontend
npm install
npm run dev
```

### Available Commands

```bash
make help          # Show all commands
make dev           # Start development
make build         # Build application
make test          # Run tests
make clean         # Clean Docker containers
make logs          # View logs
```

### Database

```bash
# Setup database locally
cd backend
./scripts/setup_database.sh

# Or use Docker
docker-compose -f docker/docker-compose.yml up -d database
```

## Project Structure

```
WWS-TS/
├── backend/           # Express.js API
│   ├── src/          # TypeScript source
│   ├── database/     # SQL schema & seeds
│   └── scripts/      # Setup scripts
├── frontend/         # React application
│   └── src/         # React components & pages
├── docker/          # Docker configuration
├── scripts/         # Build & deployment scripts
└── Makefile        # Common commands
```

## Features

- **Wood Type Selection:** Domestic, exotic, plywood categories
- **Species Table:** Sortable columns with species, size, price, grade, vendor
- **Search & Filter:** Find species by name, vendor, or grade
- **Favorites:** Save up to 32 preferred species
- **Responsive:** Mobile-friendly interface

## Database Schema

| Column | Type | Description |
|--------|------|-------------|
| species | VARCHAR | Species name |
| size | VARCHAR | Size (quarters: 4/4, 6/4, etc) |
| price | DECIMAL | Price per board foot |
| grade | VARCHAR | Grade classification |
| vendor | VARCHAR | Vendor/supplier name |
| wood_type | ENUM | domestic, exotic, plywood |

## Deployment

### Development
```bash
docker-compose -f docker/docker-compose.yml up -d
```

### Production
```bash
cp .env.example .env  # Configure environment
./scripts/deploy_prod.sh
```