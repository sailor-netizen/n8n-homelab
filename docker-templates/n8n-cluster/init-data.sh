#!/bin/bash
set -e

# Function to create user and database
function create_user_and_database() {
	local database=$1
	echo "  Creating user and database '$database'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	    SELECT 'CREATE DATABASE $database'
	    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$database')\gexec
EOSQL
}

if [ -n "$DB_N8N_HOMELAB" ]; then
	create_user_and_database $DB_N8N_HOMELAB
fi

if [ -n "$DB_N8N_GAME" ]; then
	create_user_and_database $DB_N8N_GAME
fi

if [ -n "$DB_N8N_AI" ]; then
	create_user_and_database $DB_N8N_AI
fi
