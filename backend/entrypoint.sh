#!/bin/sh
set -e

echo "Aguardando PostgreSQL..."
sleep 5

echo "Executando migrations..."
npm run migration:run || true

echo "Executando seeds..."
npm run seed:run || true

echo "Iniciando aplicação..."
exec "$@"
