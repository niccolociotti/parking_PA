#!/bin/sh
set -e

# Check if the database is ready
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Waiting for database at $DB_HOST:$DB_PORT..."
  sleep 1
done

npm run migrate-undo
npm run migrate
npm run seed

# Start the server
exec "$@"
