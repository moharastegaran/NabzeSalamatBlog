<?php

namespace App\Providers;

use App\Database\NeonPostgresConnector;
use Illuminate\Database\Connection;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind('db.connector.pgsql', NeonPostgresConnector::class);
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}