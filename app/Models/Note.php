<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Note extends Model
{
    protected $fillable = ['user_id', 'body', 'is_done', 'due_date', 'reminder_sent_at'];

    protected function casts(): array
    {
        return [
            'is_done'          => 'boolean',
            'due_date'         => 'date:Y-m-d',
            'reminder_sent_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
