<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Rename existing name → slug (preserves the unique constraint)
        Schema::table('roles', function (Blueprint $table) {
            $table->renameColumn('name', 'slug');
        });

        // Add a new display-name column before slug
        Schema::table('roles', function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('name');
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->renameColumn('slug', 'name');
        });
    }
};
