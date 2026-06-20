<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogPostView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'post_id',
        'token',
        'view_count',
        'referrer_domain',
        'utm_source',
        'utm_medium',
        'device_type',
        'reading_seconds',
        'viewed_at',
    ];

    protected function casts(): array
    {
        return ['viewed_at' => 'datetime'];
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class, 'post_id');
    }
}
