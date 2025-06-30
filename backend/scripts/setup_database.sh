#!/bin/bash

# Hardwood Species Selector - Database Setup Script
# Usage: ./setup-database.sh [options]
# Options:
#   --force          Skip confirmation prompts
#   --user=USER      Database user (default: current user)
#   --password=PASS  Database password
#   --host=HOST      Database host (default: localhost)
#   --port=PORT      Database port (default: 5432)
#   --name=NAME      Database name (default: hardwood_selector)

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Default configuration
DB_NAME="hardwood_selector"
DB_USER="${DB_USER:-$USER}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_PASSWORD="${DB_PASSWORD:-}"
FORCE_MODE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --force)
            FORCE_MODE=true
            shift
            ;;
        --user=*)
            DB_USER="${1#*=}"
            shift
            ;;
        --password=*)
            DB_PASSWORD="${1#*=}"
            shift
            ;;
        --host=*)
            DB_HOST="${1#*=}"
            shift
            ;;
        --port=*)
            DB_PORT="${1#*=}"
            shift
            ;;
        --name=*)
            DB_NAME="${1#*=}"
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --force              Skip confirmation prompts"
            echo "  --user=USER          Database user (default: $USER)"
            echo "  --password=PASS      Database password"
            echo "  --host=HOST          Database host (default: localhost)"
            echo "  --port=PORT          Database port (default: 5432)"
            echo "  --name=NAME          Database name (default: hardwood_selector)"
            echo "  --help, -h           Show this help message"
            echo ""
            echo "Environment variables can also be used:"
            echo "  DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Try to find the backend directory (script could be in scripts/ or root)
if [[ -f "$SCRIPT_DIR/../database/schema.sql" ]]; then
    BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
elif [[ -f "$SCRIPT_DIR/database/schema.sql" ]]; then
    BACKEND_DIR="$SCRIPT_DIR"
elif [[ -f "$SCRIPT_DIR/backend/database/schema.sql" ]]; then
    BACKEND_DIR="$SCRIPT_DIR/backend"
else
    echo -e "${RED}[ERROR]${NC} Cannot find database/schema.sql file"
    echo "Please run this script from the project root or backend directory"
    exit 1
fi

echo -e "${BOLD}${BLUE}🪵 Hardwood Species Selector - Database Setup${NC}"
echo "=================================================="
echo "Configuration:"
echo "  Database: $DB_NAME"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo "  Password: ${DB_PASSWORD:+[set]}${DB_PASSWORD:-[not set]}"
echo "  Backend Dir: $BACKEND_DIR"
echo ""

# Function to print status messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to build psql command with connection parameters
build_psql_cmd() {
    local database="$1"
    local cmd="psql"
    
    if [[ "$DB_HOST" != "localhost" ]]; then
        cmd="$cmd -h $DB_HOST"
    fi
    if [[ "$DB_PORT" != "5432" ]]; then
        cmd="$cmd -p $DB_PORT"
    fi
    if [[ -n "$DB_USER" ]]; then
        cmd="$cmd -U $DB_USER"
    fi
    cmd="$cmd -d $database"
    
    echo "$cmd"
}

# Function to execute psql command
execute_psql() {
    local database="$1"
    local command="$2"
    local psql_cmd
    
    psql_cmd=$(build_psql_cmd "$database")
    
    if [[ -n "$DB_PASSWORD" ]]; then
        PGPASSWORD="$DB_PASSWORD" $psql_cmd -c "$command"
    else
        $psql_cmd -c "$command"
    fi
}

# Function to execute psql file
execute_psql_file() {
    local database="$1"
    local file="$2"
    local psql_cmd
    
    psql_cmd=$(build_psql_cmd "$database")
    
    if [[ -n "$DB_PASSWORD" ]]; then
        PGPASSWORD="$DB_PASSWORD" $psql_cmd -f "$file"
    else
        $psql_cmd -f "$file"
    fi
}

# Function to check PostgreSQL connection
check_postgres_connection() {
    if execute_psql "postgres" "SELECT 1;" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to check if database exists
database_exists() {
    local result
    result=$(execute_psql "postgres" "SELECT 1 FROM pg_database WHERE datname='$DB_NAME';" 2>/dev/null | grep -c "1" || echo "0")
    [[ "$result" -gt 0 ]]
}

# Function to ask for confirmation
ask_confirmation() {
    local question="$1"
    local default="${2:-N}"
    
    if [[ "$FORCE_MODE" == "true" ]]; then
        return 0
    fi
    
    while true; do
        if [[ "$default" == "Y" ]]; then
            read -p "$question (Y/n): " -n 1 -r
            echo
            [[ -z "$REPLY" ]] && REPLY="Y"
        else
            read -p "$question (y/N): " -n 1 -r
            echo
            [[ -z "$REPLY" ]] && REPLY="N"
        fi
        
        case $REPLY in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

# Check if psql is installed
print_status "Checking for PostgreSQL installation..."
if ! command_exists psql; then
    print_error "PostgreSQL client (psql) is not installed or not in PATH"
    echo ""
    echo "Please install PostgreSQL:"
    echo "  • macOS: brew install postgresql"
    echo "  • Ubuntu/Debian: sudo apt-get install postgresql postgresql-client"
    echo "  • CentOS/RHEL: sudo yum install postgresql postgresql-server"
    echo "  • Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

print_success "PostgreSQL client found: $(psql --version | head -n1)"

# Check if PostgreSQL server is running
print_status "Checking PostgreSQL server connection..."
if ! check_postgres_connection; then
    print_error "Cannot connect to PostgreSQL server"
    echo ""
    echo "Please ensure PostgreSQL server is running:"
    echo "  • macOS: brew services start postgresql"
    echo "  • Linux: sudo systemctl start postgresql"
    echo "  • Windows: Start PostgreSQL service"
    echo ""
    echo "You can also check connection with:"
    echo "  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c 'SELECT version();'"
    exit 1
fi

print_success "Connected to PostgreSQL server"

# Check if database already exists
print_status "Checking if database '$DB_NAME' exists..."
if database_exists; then
    print_warning "Database '$DB_NAME' already exists"
    if ask_confirmation "Do you want to recreate it? This will DELETE ALL DATA!"; then
        print_status "Dropping existing database..."
        if [[ -n "$DB_PASSWORD" ]]; then
            PGPASSWORD="$DB_PASSWORD" dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
        else
            dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
        fi
        print_success "Database dropped"
    else
        print_status "Keeping existing database, will attempt to update schema..."
    fi
fi

# Create database if it doesn't exist
if ! database_exists; then
    print_status "Creating database '$DB_NAME'..."
    if [[ -n "$DB_PASSWORD" ]]; then
        if PGPASSWORD="$DB_PASSWORD" createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"; then
            print_success "Database '$DB_NAME' created successfully"
        else
            print_error "Failed to create database '$DB_NAME'"
            exit 1
        fi
    else
        if createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"; then
            print_success "Database '$DB_NAME' created successfully"
        else
            print_error "Failed to create database '$DB_NAME'"
            exit 1
        fi
    fi
else
    print_status "Using existing database '$DB_NAME'"
fi

# Check for schema and seed files
SCHEMA_FILE="$BACKEND_DIR/database/schema.sql"
SEED_FILE="$BACKEND_DIR/database/seed.sql"

if [[ ! -f "$SCHEMA_FILE" ]]; then
    print_error "Schema file not found: $SCHEMA_FILE"
    exit 1
fi

if [[ ! -f "$SEED_FILE" ]]; then
    print_error "Seed file not found: $SEED_FILE"
    exit 1
fi

print_status "Found required files:"
echo "  Schema: $SCHEMA_FILE"
echo "  Seed:   $SEED_FILE"

# Apply schema
print_status "Applying database schema..."
if execute_psql_file "$DB_NAME" "$SCHEMA_FILE" >/dev/null 2>&1; then
    print_success "Schema applied successfully"
else
    print_error "Failed to apply schema"
    echo "Try running manually: $(build_psql_cmd "$DB_NAME") -f \"$SCHEMA_FILE\""
    exit 1
fi

# Apply seed data
print_status "Loading seed data..."
if execute_psql_file "$DB_NAME" "$SEED_FILE" >/dev/null 2>&1; then
    print_success "Seed data loaded successfully"
else
    print_error "Failed to load seed data"
    echo "Try running manually: $(build_psql_cmd "$DB_NAME") -f \"$SEED_FILE\""
    exit 1
fi

# Verify setup
print_status "Verifying database setup..."
SPECIES_COUNT=$(execute_psql "$DB_NAME" "SELECT COUNT(*) FROM wood_species;" 2>/dev/null | grep -E '^[[:space:]]*[0-9]+[[:space:]]*$' | tr -d '[:space:]' || echo "0")

if [[ "$SPECIES_COUNT" -gt 0 ]]; then
    print_success "Database setup complete! Found $SPECIES_COUNT wood species records"
    
    # Show breakdown by type
    echo ""
    echo "Species breakdown:"
    execute_psql "$DB_NAME" "
        SELECT 
            RPAD(wood_type::text, 12) || ': ' || COUNT(*) as breakdown
        FROM wood_species 
        GROUP BY wood_type 
        ORDER BY wood_type;
    " 2>/dev/null | grep -E '^\s*(domestic|exotic|plywood)' || echo "  Unable to show breakdown"
else
    print_warning "Database created but no species data found (count: $SPECIES_COUNT)"
fi

echo ""
print_success "✅ Database setup completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Set up your backend/.env file with database credentials"
echo "  2. Run: cd backend && npm run dev"
echo ""
echo "Database connection details:"
echo "  Database: $DB_NAME"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo ""
echo "Test connection:"
echo "  $(build_psql_cmd "$DB_NAME") -c 'SELECT COUNT(*) FROM wood_species;'"