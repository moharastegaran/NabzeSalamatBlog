<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('blog_posts', 'lead')) {
            return;
        }

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn('lead');
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('blog_posts', 'lead')) {
            return;
        }

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->text('lead')->nullable()->after('excerpt');
        });
    }
};
