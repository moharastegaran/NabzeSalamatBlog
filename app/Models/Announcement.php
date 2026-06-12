<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Announcement extends Model
{
    protected $fillable = ['sent_by', 'message', 'is_urgent', 'recalled_at'];

    protected $casts = [
        'is_urgent'   => 'boolean',
        'recalled_at' => 'datetime',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sent_by');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function getReadCountAttribute(): int
    {
        return \DB::table('notifications')
            ->where('type', \App\Notifications\AnnouncementBroadcast::class)
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.announcement_id')) = ?", [(string) $this->id])
            ->whereNotNull('read_at')
            ->count();
    }
}
