<?php

use App\Models\PageContent;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        PageContent::query()->updateOrCreate(
            ['slug' => 'contact'],
            [
                'title'   => PageContent::defaultTitle('contact'),
                'content' => PageContent::contactDefaults(),
            ],
        );
    }

    public function down(): void
    {
        PageContent::query()->where('slug', 'contact')->delete();
    }
};
