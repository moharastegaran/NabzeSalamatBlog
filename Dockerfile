# Stage 1: build frontend assets
FROM node:20-alpine AS node-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY resources/ ./resources/
COPY public/ ./public/
COPY vite.config.js tsconfig.json postcss.config.js tailwind.config.js ./
RUN npx vite build && npx vite build --ssr

# Stage 2: shared PHP base (extensions only — no Composer)
FROM php:8.2-fpm-alpine AS php-base

# Prefer mirrors reachable from Iran / restricted DNS (dl-cdn & kernel.org often fail)
RUN set -eux; \
    ALPINE_VER="$(cut -d. -f1,2 /etc/alpine-release)"; \
    ok=0; \
    for mirror in \
        "https://mirror.arvancloud.ir/alpine" \
        "https://mirrors.aliyun.com/alpine" \
        "https://mirrors.huaweicloud.com/alpine" \
        "https://mirrors.edge.kernel.org/alpine" \
        "https://dl-cdn.alpinelinux.org/alpine" \
    ; do \
        printf '%s\n' \
            "${mirror}/v${ALPINE_VER}/main" \
            "${mirror}/v${ALPINE_VER}/community" \
            > /etc/apk/repositories; \
        if apk update --no-cache; then \
            echo "Using Alpine mirror: ${mirror}"; \
            ok=1; \
            break; \
        fi; \
        echo "Mirror failed: ${mirror}"; \
    done; \
    test "$ok" -eq 1

# Runtime shared libs are detected after compile; build toolchain is purged
RUN apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libzip-dev \
        icu-dev \
        oniguruma-dev \
        libxml2-dev \
        zip \
        unzip \
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
    && (wget -qO- https://github.com/phpredis/phpredis/archive/refs/tags/6.1.0.tar.gz \
        || wget -qO- https://ghproxy.com/https://github.com/phpredis/phpredis/archive/refs/tags/6.1.0.tar.gz \
        || wget -qO- https://mirror.ghproxy.com/https://github.com/phpredis/phpredis/archive/refs/tags/6.1.0.tar.gz) \
        | tar xz -C /tmp/phpredis --strip-components=1 \
    && cd /tmp/phpredis \
    && phpize \
    && ./configure \
    && make -j$(nproc) \
    && make install \
    && docker-php-ext-enable redis \
    && runDeps="$( \
        scanelf --needed --nobanner --format '%n#p' --recursive /usr/local \
            | tr ',' '\n' \
            | sort -u \
            | awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
    )" \
    && apk add --no-cache --virtual .php-rundeps $runDeps zip unzip \
    && apk del --no-network .build-deps \
    && rm -rf /tmp/phpredis /tmp/* /var/cache/apk/*

# Stage 3: Composer vendor build (discarded from final app image)
FROM php-base AS vendor
WORKDIR /app
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --prefer-dist --optimize-autoloader --no-interaction \
    && find vendor/mpdf/mpdf/ttfonts -type f ! -name 'DejaVuSans*.ttf' -delete \
    && rm -rf /root/.composer /tmp/*

# Stage 4: production app
FROM php-base AS app

WORKDIR /var/www/html

COPY --from=vendor --chown=www-data:www-data /app/vendor ./vendor
COPY --chown=www-data:www-data app ./app
COPY --chown=www-data:www-data bootstrap ./bootstrap
COPY --chown=www-data:www-data config ./config
COPY --chown=www-data:www-data database ./database
COPY --chown=www-data:www-data lang ./lang
COPY --chown=www-data:www-data public ./public
COPY --chown=www-data:www-data routes ./routes
COPY --chown=www-data:www-data resources/views ./resources/views
COPY --chown=www-data:www-data artisan composer.json composer.lock ./
COPY --from=node-builder --chown=www-data:www-data /app/public/build ./public/build

RUN rm -f public/hot \
    && mkdir -p \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/framework/testing \
        storage/logs \
        storage/app/public \
        storage/app/private \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

COPY --chown=www-data:www-data docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/php/entrypoint.sh /entrypoint.sh
COPY docker/php/entrypoint-worker.sh /entrypoint-worker.sh
RUN chmod +x /entrypoint.sh /entrypoint-worker.sh

EXPOSE 9000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["php-fpm"]

# Stage 5: dev app (no source copy — uses volume mounts)
FROM php-base AS dev

WORKDIR /var/www/html

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/php/php-dev.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/php/entrypoint-dev.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["php-fpm"]

# Stage 6: Inertia SSR Node server (prod) — self-contained image for crawlers
# Reuse node-builder modules: Vite SSR leaves react/@inertiajs/react/etc. external,
# and those packages live under devDependencies, so `npm ci --omit=dev` cannot boot ssr.js.
FROM node:20-alpine AS ssr
WORKDIR /app
COPY --from=node-builder /app/package.json /app/package-lock.json ./
COPY --from=node-builder /app/node_modules ./node_modules
COPY --from=node-builder /app/bootstrap/ssr ./bootstrap/ssr
EXPOSE 13714
HEALTHCHECK --interval=15s --timeout=5s --start-period=25s --retries=8 \
    CMD node -e "require('http').request({host:'127.0.0.1',port:13714,method:'GET'},r=>process.exit(0)).on('error',()=>process.exit(1)).end()"
CMD ["node", "bootstrap/ssr/ssr.js"]

# Stage 7: nginx with static files baked in (prod only)
FROM nginx:alpine AS nginx
COPY --from=app /var/www/html/public /var/www/html/public
COPY docker/nginx/snippets/ /etc/nginx/snippets/
COPY docker/nginx/prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
