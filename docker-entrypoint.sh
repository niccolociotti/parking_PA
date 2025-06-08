#!/bin/sh
set -e

npm run migrate-undo
npm run migrate
npm run seed

# Start the server
exec "$@"
