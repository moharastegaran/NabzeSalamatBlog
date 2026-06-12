#!/bin/sh
set -e

php artisan storage:link --force
php artisan migrate --force

php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true
php artisan event:cache || true

exec "$@"
