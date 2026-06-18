<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CategoryMediaRequirement extends Model
{
    protected $fillable = [
        'blog_category_id',
        'collection_name',
        'label',
        'is_required',
        'allowed_mime_types',
        'sort_order',
    ];

    protected $casts = [
        'is_required'        => 'boolean',
        'allowed_mime_types' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    /**
     * Returns the effective MIME types for this requirement.
     * Falls back to the BlogPost collection defaults when not overridden.
     */
    public function effectiveMimeTypes(): ?array
    {
        if ($this->allowed_mime_types !== null) {
            return $this->allowed_mime_types;
        }

        return BlogPost::MEDIA_COLLECTIONS[$this->collection_name] ?? null;
    }
}
