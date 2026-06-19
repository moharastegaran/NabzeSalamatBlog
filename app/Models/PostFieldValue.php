<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostFieldValue extends Model
{
    protected $fillable = [
        'blog_post_id',
        'category_field_definition_id',
        'value',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class, 'blog_post_id');
    }

    public function definition(): BelongsTo
    {
        return $this->belongsTo(CategoryFieldDefinition::class, 'category_field_definition_id');
    }
}
