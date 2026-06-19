<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class AdBanner extends Model
{
    public const LOCATIONS = [
        'landing'    => 'صفحه اصلی',
        'blog'       => 'لیست وبلاگ',
        'catarchive' => 'آرشیو دسته‌بندی',
        'tagarchive' => 'آرشیو برچسب',
        'blogsingle' => 'صفحه مقاله',
    ];

    protected $fillable = [
        'title', 'image', 'external_url', 'locations',
        'is_active', 'active_from', 'active_until', 'sort_order',
    ];

    protected $casts = [
        'locations'    => 'array',
        'is_active'    => 'boolean',
        'active_from'  => 'datetime',
        'active_until' => 'datetime',
    ];

    public function scopeActiveForLocation(Builder $query, string $location): Builder
    {
        return $query
            ->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('active_from')->orWhere('active_from', '<=', now()))
            ->where(fn ($q) => $q->whereNull('active_until')->orWhere('active_until', '>=', now()))
            ->whereJsonContains('locations', $location)
            ->orderBy('sort_order')
            ->orderBy('id');
    }
}
