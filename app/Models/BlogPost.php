<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;
use App\Models\BlogPostView;

class BlogPost extends Model
{
    protected $fillable = [
        'author_id',
        'blog_category_id',
        'title',
        'subtitle',
        'slug',
        'short_link',
        'excerpt',
        'lead',
        'body',
        'featured_image',
        'video_url',
        'status',
        'publish_at',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'publish_at'   => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function ($m) {
            $m->slug       ??= Str::slug($m->title);
            $m->short_link ??= static::generateShortLink();
        });
    }

    protected static function generateShortLink(): string
    {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        do {
            $alpha = '';
            for ($i = 0; $i < 5; $i++) {
                $alpha .= $chars[random_int(0, strlen($chars) - 1)];
            }
            $code = $alpha . random_int(1, 9);
        } while (static::where('short_link', $code)->exists());
        return $code;
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
        // status = 'published' is the single source of truth;
        // published_at is just the system-stamped fact of when it went live.
        return $query->where('status', 'published');
    }

    /**
     * Order by trending score: last-24h views × 3 + last-7d views.
     * Falls back to all-time views when the view log is empty.
     */
    public function scopeTrending($query, int $days = 7)
    {
        return $query->orderByRaw(
            '(SELECT COALESCE(SUM(CASE WHEN viewed_at >= ? THEN view_count * 3 ELSE view_count END), 0)
              FROM blog_post_views WHERE post_id = blog_posts.id AND viewed_at >= ?) DESC',
            [now()->subDay(), now()->subDays($days)]
        )->orderByDesc('views');
    }

    /**
     * Order by view count within the given period ('today' or 'week').
     * Falls back to all-time views when the view log is empty.
     */
    public function scopeMostRead($query, string $period = 'week')
    {
        $since = $period === 'today' ? now()->startOfDay() : now()->subWeek();

        return $query->orderByRaw(
            '(SELECT COALESCE(SUM(view_count), 0)
              FROM blog_post_views WHERE post_id = blog_posts.id AND viewed_at >= ?) DESC',
            [$since]
        )->orderByDesc('views');
    }

    public function viewLogs(): HasMany
    {
        return $this->hasMany(BlogPostView::class, 'post_id');
    }

    /**
     * Fixed media collections supported by every BlogPost.
     * Keys are collection_name values; values are the default allowed MIME types
     * (null means unrestricted). Category requirements may narrow these further.
     */
    public const MEDIA_COLLECTIONS = [
        'image'      => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
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

    public function getTimeToReadAttribute(): int
    {
        $text  = strip_tags($this->body ?? '');
        $words = preg_split('/\s+/u', trim($text), -1, PREG_SPLIT_NO_EMPTY);
        return max(1, (int) ceil(count($words) / 200));
    }

    public function getMissingRequiredFields(): \Illuminate\Support\Collection
    {
        $allDefs = $this->categories
            ->flatMap(fn ($cat) => $cat->fieldDefinitions)
            ->unique('id');

        return $allDefs
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
