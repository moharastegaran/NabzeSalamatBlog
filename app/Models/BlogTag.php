<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class BlogTag extends Model
{
    protected $fillable = ['name', 'slug'];

    protected static function booted(): void
    {
        static::creating(function (self $m) {
            if ($m->slug) {
                return;
            }

            $base = Str::slug($m->name);
            if ($base === '') {
                $base = 'tag-' . substr(md5($m->name), 0, 10);
            }

            $slug = $base;
            $i = 2;
            while (static::where('slug', $slug)->exists()) {
                $slug = "{$base}-{$i}";
                $i++;
            }

            $m->slug = $slug;
        });
    }

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(BlogPost::class, 'blog_post_tag');
    }
}
