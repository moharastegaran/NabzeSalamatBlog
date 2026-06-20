<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            // Expand the enum to include the new 'scheduled' state.
            $table->enum('status', ['draft', 'scheduled', 'published'])->default('draft')->change();

            // publish_at  = editor's intent  (when they want it to go live)
            // published_at = system fact     (stamped the moment it actually went live)
            $table->timestamp('publish_at')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn('publish_at');
            $table->enum('status', ['draft', 'published'])->default('draft')->change();
        });
    }
};
