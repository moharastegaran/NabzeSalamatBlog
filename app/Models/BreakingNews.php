<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BreakingNews extends Model
{
    protected $fillable = ['title', 'url', 'is_active', 'active_from', 'active_until'];

    protected $casts = [
        'is_active'    => 'boolean',
        'active_from'  => 'datetime',
        'active_until' => 'datetime',
    ];
}
