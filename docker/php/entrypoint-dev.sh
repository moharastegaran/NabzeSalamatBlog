#!/bin/sh
set -e

composer install --no-interaction --prefer-dist

php artisan storage:link --force
php artisan migrate --force

exec "$@"
