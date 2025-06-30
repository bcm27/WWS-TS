#!/bin/bash

# wait-for-db.sh - Wait for PostgreSQL to be ready

set -e

host="$1"
port="$2"
database="$3"
user="$4"
password="$5"
shift 5
cmd="$@"

echo "Waiting for PostgreSQL at $host:$port..."

export PGPASSWORD="$password"

until psql -h "$host" -p "$port" -U "$user" -d "$database" -c '\q' 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up!"

# Also wait for our specific database and table to exist
echo "Waiting for wood_species table..."

until psql -h "$host" -p "$port" -U "$user" -d "$database" -c "SELECT COUNT(*) FROM wood_species;" >/dev/null 2>&1; do
  echo "wood_species table not ready - sleeping"
  sleep 2
done

echo "wood_species table is ready!"

exec $cmd