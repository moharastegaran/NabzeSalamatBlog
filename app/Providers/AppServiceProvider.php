<?php

namespace App\Providers;

use App\Database\NeonPostgresConnector;
use Illuminate\Support\Facades\URL;
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

        // CDN terminates TLS and proxies HTTP to origin — keep generated URLs on https://nabzsn.ir
        // so browsers never load mixed http assets/links.
        $appUrl = rtrim((string) config('app.url'), '/');
        if (str_starts_with($appUrl, 'https://')) {
            URL::forceScheme('https');
            URL::forceRootUrl($appUrl);
        }
    }
}
