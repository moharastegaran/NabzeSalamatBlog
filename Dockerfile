# Stage 1: build frontend assets
FROM node:20-alpine AS node-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY resources/ ./resources/
COPY public/ ./public/
COPY vite.config.js tsconfig.json postcss.config.js tailwind.config.js ./
RUN npx vite build && npx vite build --ssr

# Stage 2: shared PHP base (extensions + composer)
FROM php:8.2-fpm-alpine AS php-base

# dl-cdn.alpinelinux.org is often unreachable from Docker Desktop DNS
RUN sed -i 's|dl-cdn.alpinelinux.org|mirrors.edge.kernel.org|g' /etc/apk/repositories

RUN apk add --no-cache \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libzip-dev \
        icu-dev \
        oniguruma-dev \
        libxml2-dev \
        zip \
        unzip \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        xml \
        opcache \
    && mkdir /tmp/phpredis \
    && wget -qO- https://github.com/phpredis/phpredis/archive/refs/tags/6.1.0.tar.gz \
        | tar xz -C /tmp/phpredis --strip-components=1 \
    && cd /tmp/phpredis \
    && phpize \
    && ./configure \
    && make -j$(nproc) \
    && make install \
    && docker-php-ext-enable redis \
    && apk del .build-deps \
    && rm -rf /tmp/phpredis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Stage 3: production app
FROM php-base AS app

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .
COPY --from=node-builder /app/public/build ./public/build
COPY --from=node-builder /app/bootstrap/ssr ./bootstrap/ssr
RUN rm -f public/hot \
    && composer dump-autoload --optimize \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/php/entrypoint.sh /entrypoint.sh
COPY docker/php/entrypoint-worker.sh /entrypoint-worker.sh
RUN chmod +x /entrypoint.sh /entrypoint-worker.sh

EXPOSE 9000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["php-fpm"]

# Stage 4: dev app (no source copy — uses volume mounts)
FROM php-base AS dev

WORKDIR /var/www/html

COPY docker/php/php-dev.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/php/entrypoint-dev.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["php-fpm"]

# Stage 5: Inertia SSR Node server (prod)
FROM node:20-alpine AS ssr
WORKDIR /app
COPY --from=node-builder /app/bootstrap/ssr ./bootstrap/ssr
EXPOSE 13714
CMD ["node", "bootstrap/ssr/ssr.js"]

# Stage 6: nginx with static files baked in (prod only)
FROM nginx:alpine AS nginx
COPY --from=app /var/www/html/public /var/www/html/public
COPY docker/nginx/snippets/ /etc/nginx/snippets/
COPY docker/nginx/prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
