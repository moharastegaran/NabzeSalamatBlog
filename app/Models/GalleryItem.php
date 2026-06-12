<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryItem extends Model
{
    protected $table = 'gallery';

    protected $fillable = [
        'event',
        'city_id',
        'img',
        'year',
        'month',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
