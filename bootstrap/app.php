<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // No web/session/Inertia middleware — Google/CDN must get clean XML/TXT.
            Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])
                ->name('sitemap');
            Route::get('/sitemap.txt', [\App\Http\Controllers\SitemapController::class, 'text'])
                ->name('sitemap.text');
            Route::get('/robots.txt', [\App\Http\Controllers\SitemapController::class, 'robots'])
                ->name('robots');
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR
                | Request::HEADER_X_FORWARDED_HOST
                | Request::HEADER_X_FORWARDED_PORT
                | Request::HEADER_X_FORWARDED_PROTO
                | Request::HEADER_X_FORWARDED_AWS_ELB
        );

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role'               => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission'         => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'front.maintenance'  => \App\Http\Middleware\CheckShopMaintenance::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->renderable(function (AuthenticationException $e, Request $request) {
            if (! $request->expectsJson() && $request->routeIs('checkout.*')) {
                return redirect()->route('customer.login');
            }
        });

        $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
            if ($request->expectsJson()) {
                return $response;
            }

            // Keep crawler endpoints as plain responses (never wrap in Inertia HTML)
            if ($request->is('sitemap.xml', 'sitemap.txt', 'robots.txt')) {
                return $response;
            }

            if ($response->getStatusCode() === 419) {
                return back()->with('error', 'صفحه منقضی شد، لطفاً دوباره امتحان کنید.');
            }

            if (in_array($response->getStatusCode(), [403, 404, 500, 503])) {
                return Inertia::render('Error', ['status' => $response->getStatusCode()])
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            }

            return $response;
        });
    })->create();
