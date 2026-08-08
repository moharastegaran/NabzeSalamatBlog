<?php

use App\Models\PageContent;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        PageContent::query()->updateOrCreate(
            ['slug' => 'advertise-modal'],
            [
                'title'   => PageContent::defaultTitle('advertise-modal'),
                'content' => PageContent::advertiseModalDefaults(),
            ],
        );
    }

    public function down(): void
    {
        PageContent::query()->where('slug', 'advertise-modal')->delete();
    }
};
