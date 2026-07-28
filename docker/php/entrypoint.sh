#!/bin/sh
set -e

mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/framework/testing
mkdir -p storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

php artisan storage:link --force
php artisan migrate --force

php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true
php artisan event:cache || true

touch /tmp/ready
exec "$@"
