# Sales Portal

A WooCommerce-integrated sales management portal built with Laravel 12, Inertia.js, React, TypeScript, and Tailwind CSS. It provides role-based access control for managing orders, products, users, and banking/payment plans.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Demo Accounts](#demo-accounts)
7. [Roles and Permissions](#roles-and-permissions)
8. [Features and Routes](#features-and-routes)
9. [WooCommerce Integration](#woocommerce-integration)
10. [Production Build](#production-build)

---

## Prerequisites

Make sure the following are installed on your machine before starting:

| Tool | Minimum Version | Check Command |
|------|----------------|---------------|
| PHP | 8.2 | `php --version` |
| Composer | 2.x | `composer --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |

You will also need access to a **PostgreSQL** database (the project is pre-configured for [Neon](https://neon.tech), a cloud PostgreSQL provider).

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd salesportal
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Install Node dependencies

```bash
npm install
```

### 4. Create the environment file

```bash
cp .env.example .env
```

### 5. Generate the application key

```bash
php artisan key:generate
```

> Alternatively, steps 2–5 can all be run with a single command:
> ```bash
> composer run setup
> ```

---

## Environment Configuration

Open `.env` and fill in the required values:

### App

```env
APP_NAME=Laravel
APP_ENV=local
APP_URL=http://localhost:8000
```

### Database (PostgreSQL / Neon)

```env
DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_PORT=5432
DB_DATABASE=your-database-name
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_SSLMODE=require
DB_ENDPOINT=your-neon-endpoint-id   # only needed for Neon
```

**Using Neon (recommended for cloud):**
1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection details from the Neon dashboard into the fields above

**Using a local PostgreSQL instance:**
1. Create a database: `createdb salesportal`
2. Set `DB_HOST=127.0.0.1`, `DB_SSLMODE=disable`, and remove `DB_ENDPOINT`

### WooCommerce Integration

```env
WC_STORE_URL=https://your-woocommerce-store.com
WC_CONSUMER_KEY=ck_your_consumer_key_here
WC_CONSUMER_SECRET=cs_your_consumer_secret_here
WC_WEBHOOK_SECRET=your_webhook_secret_here
```

To get these values from your WooCommerce store:
1. Go to **WooCommerce > Settings > Advanced > REST API**
2. Click **Add key**, set permissions to **Read/Write**, and generate
3. Copy the Consumer Key and Consumer Secret into your `.env`

---

## Database Setup

### Run migrations

This creates all required tables:

```bash
php artisan migrate
```

### Seed the database

This creates roles, permissions, demo users, and sample banking data:

```bash
php artisan db:seed
```

To reset and re-seed from scratch:

```bash
php artisan migrate:fresh --seed
```

---

## Running the Application

You need **two terminal windows** open at the same time, both inside the `salesportal` directory.

### Terminal 1 — Laravel backend

```bash
php artisan serve
```

The app will be available at **http://localhost:8000**

### Terminal 2 — Vite frontend (hot reload)

```bash
npm run dev
```

### One-command alternative (runs all services together)

This starts the PHP server, queue worker, log watcher, and Vite dev server simultaneously:

```bash
composer run dev
```

> Requires `concurrently` (already listed in `package.json` devDependencies).

---

## Demo Accounts

After running the seeder, the following accounts are available. All passwords are `password`.

| Email | Role | Access Level |
|-------|------|-------------|
| admin@salesportal.test | Admin | Full access |
| manager@salesportal.test | Sales Manager | Orders, products, user management |
| retail@salesportal.test | Sales Retail | View and create orders, view products |
| cfo@salesportal.test | CFO | View and approve/discard orders |

---

## Roles and Permissions

| Permission | Admin | Sales Manager | Sales Retail | CFO |
|------------|:-----:|:-------------:|:------------:|:---:|
| orders.view | ✓ | ✓ | ✓ | ✓ |
| orders.create | ✓ | ✓ | ✓ | |
| orders.approve | ✓ | ✓ | | ✓ |
| orders.discard | ✓ | ✓ | | ✓ |
| products.view | ✓ | ✓ | ✓ | |
| products.sync | ✓ | | | |
| users.view | ✓ | ✓ | | |
| users.suspend | ✓ | ✓ | | |
| users.delete | ✓ | | | |

---

## Features and Routes

| Route | Description |
|-------|-------------|
| `GET /` | Redirects to login |
| `GET /dashboard` | Main dashboard (authenticated) |
| `GET /orders` | List all orders |
| `GET /orders/create` | New order form |
| `POST /orders` | Submit a new order |
| `GET /orders/{id}` | View order details |
| `POST /orders/{id}/approve` | Approve an order |
| `POST /orders/{id}/discard` | Discard an order |
| `GET /products` | List all products |
| `POST /products/sync` | Sync products from WooCommerce |
| `GET /users` | List all users |
| `POST /users/{id}/suspend` | Suspend a user account |
| `DELETE /users/{id}` | Delete a user |
| `GET /profile` | Edit your profile |

---

## WooCommerce Integration

The **Products > Sync** action pulls product data from your connected WooCommerce store via the REST API. Ensure the `WC_*` values in your `.env` are correctly set before using this feature.

Webhooks from WooCommerce (e.g., order status updates) are handled via the API routes defined in `routes/api.php`. Use `WC_WEBHOOK_SECRET` to verify incoming webhook signatures.

---

## Production Build

To compile and minify frontend assets for production:

```bash
npm run build
```

Then serve the app using a proper web server (Nginx, Apache) or:

```bash
php artisan serve --env=production
```

For production deployments also run:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:work --daemon
```
