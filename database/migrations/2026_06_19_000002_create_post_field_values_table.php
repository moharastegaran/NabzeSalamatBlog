<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_field_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_post_id')
                  ->constrained('blog_posts')
                  ->cascadeOnDelete();
            $table->foreignId('category_field_definition_id')
                  ->constrained('category_field_definitions')
                  ->cascadeOnDelete();
            $table->text('value')->nullable();
            $table->timestamps();

            $table->unique(['blog_post_id', 'category_field_definition_id'], 'post_field_value_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_field_values');
    }
};
