<?php

use App\Models\PageContent;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        PageContent::query()->updateOrCreate(
            ['slug' => 'footer-brand'],
            [
                'title'   => PageContent::defaultTitle('footer-brand'),
                'content' => PageContent::footerBrandDefaults(),
            ],
        );
    }

    public function down(): void
    {
        PageContent::query()->where('slug', 'footer-brand')->delete();
    }
};
