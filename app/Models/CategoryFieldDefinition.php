<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoryFieldDefinition extends Model
{
    public const FIELD_TYPES = ['file', 'text', 'number', 'select', 'date'];

    protected $fillable = [
        'blog_category_id',
        'field_key',
        'field_type',
        'label',
        'is_required',
        'options',
        'sort_order',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'options'     => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    public function fieldValues(): HasMany
    {
        return $this->hasMany(PostFieldValue::class);
    }

    /**
     * For field_type='file': returns the effective allowed MIME types.
     * Falls back to BlogPost collection defaults when options doesn't override them.
     */
    public function effectiveMimeTypes(): ?array
    {
        if ($this->field_type !== 'file') {
            return null;
        }

        return $this->options['allowed_mime_types'] ?? BlogPost::MEDIA_COLLECTIONS[$this->field_key] ?? null;
    }

    /**
     * For field_type='select': returns the choice list.
     * Each item has 'value' and 'label'.
     */
    public function choices(): array
    {
        return $this->options['choices'] ?? [];
    }
}
