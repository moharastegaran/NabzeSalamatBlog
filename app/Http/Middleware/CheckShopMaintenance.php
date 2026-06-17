<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckShopMaintenance
{
    public function handle(Request $request, Closure $next): Response
    {
        if (cache()->get('shop_maintenance', false)) {
            if (auth()->check() && auth()->user()->hasRole('admin')) {
                return $next($request);
            }

            return redirect()->route('front.maintenance');
        }

        return $next($request);
    }
}
