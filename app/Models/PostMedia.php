<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class PostMedia extends Model
{
    protected $table = 'post_media';

    protected $fillable = [
        'model_type',
        'model_id',
        'collection_name',
        'name',
        'file_name',
        'path',
        'disk',
        'mime_type',
        'size',
        'custom_properties',
        'order_column',
    ];

    protected $casts = [
        'custom_properties' => 'array',
        'size'              => 'integer',
    ];

    protected $appends = ['url', 'human_readable_size'];

    public function model(): MorphTo
    {
        return $this->morphTo();
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function getHumanReadableSizeAttribute(): string
    {
        $bytes = $this->size;
        foreach (['B', 'KB', 'MB', 'GB'] as $unit) {
            if ($bytes < 1024) {
                return round($bytes, 2) . ' ' . $unit;
            }
            $bytes /= 1024;
        }
        return round($bytes, 2) . ' TB';
    }

    public function getCustomProperty(string $key, mixed $default = null): mixed
    {
        return data_get($this->custom_properties, $key, $default);
    }
}
