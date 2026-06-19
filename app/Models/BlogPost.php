<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    protected $fillable = [
        'author_id',
        'blog_category_id',
        'title',
        'slug',
        'excerpt',
        'body',
        'featured_image',
        'video_url',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(fn ($m) => $m->slug ??= Str::slug($m->title));
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(BlogTag::class, 'blog_post_tag');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(BlogCategory::class, 'blog_post_categories');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(BlogComment::class);
    }

    public function approvedComments(): HasMany
    {
        return $this->hasMany(BlogComment::class)->where('is_approved', true);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()));
    }

    /**
     * Fixed media collections supported by every BlogPost.
     * Keys are collection_name values; values are the default allowed MIME types
     * (null means unrestricted). Category requirements may narrow these further.
     */
    public const MEDIA_COLLECTIONS = [
        'audio'      => ['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/flac', 'audio/x-flac'],
        'video'      => ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska'],
        'transcript' => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        'attachment' => null,
    ];

    public function media(): MorphMany
    {
        return $this->morphMany(PostMedia::class, 'model')->orderBy('order_column');
    }

    public function getMedia(string $collection): \Illuminate\Database\Eloquent\Collection
    {
        return $this->media()->where('collection_name', $collection)->get();
    }

    public function getFirstMedia(string $collection): ?PostMedia
    {
        return $this->media()->where('collection_name', $collection)->first();
    }

    public function fieldValues(): HasMany
    {
        return $this->hasMany(PostFieldValue::class, 'blog_post_id');
    }

    public function getMissingRequiredFields(): \Illuminate\Support\Collection
    {
        return ($this->category?->fieldDefinitions ?? collect())
            ->where('is_required', true)
            ->filter(function ($def) {
                if ($def->field_type === 'file') {
                    return $this->getFirstMedia($def->field_key) === null;
                }
                return $this->fieldValues()
                    ->where('category_field_definition_id', $def->id)
                    ->doesntExist();
            });
    }
}
