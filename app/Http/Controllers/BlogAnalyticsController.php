<?php

namespace App\Http\Controllers;

use App\Services\BlogAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogAnalyticsController extends Controller
{
    public function __construct(private BlogAnalyticsService $analytics) {}

    public function index(Request $request): Response
    {
        $range = match ($request->query('range', '30d')) {
            '7d'  => 7,
            '90d' => 90,
            default => 30,
        };

        return Inertia::render('BlogAnalytics', [
            'range'    => $request->query('range', '30d'),
            'analytics' => $this->analytics->all($range),
        ]);
    }
}
