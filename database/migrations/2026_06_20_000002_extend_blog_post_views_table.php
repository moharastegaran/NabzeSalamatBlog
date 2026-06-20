<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_post_views', function (Blueprint $table) {
            $table->char('token', 36)->nullable()->unique()->after('view_count');
            $table->string('referrer_domain', 255)->nullable()->after('token');
            $table->string('utm_source', 100)->nullable()->after('referrer_domain');
            $table->string('utm_medium', 100)->nullable()->after('utm_source');
            $table->string('device_type', 10)->nullable()->after('utm_medium');   // desktop|mobile|tablet
            $table->unsignedSmallInteger('reading_seconds')->nullable()->after('device_type');

            $table->index('referrer_domain');
            $table->index('token');
        });
    }

    public function down(): void
    {
        Schema::table('blog_post_views', function (Blueprint $table) {
            $table->dropIndex(['referrer_domain']);
            $table->dropIndex(['token']);
            $table->dropColumn(['token', 'referrer_domain', 'utm_source', 'utm_medium', 'device_type', 'reading_seconds']);
        });
    }
};
