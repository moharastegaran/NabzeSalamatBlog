<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('category_media_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_category_id')->constrained()->cascadeOnDelete();
            $table->string('collection_name');                // must match a BlogPost::MEDIA_COLLECTIONS key
            $table->string('label');                          // human-readable, e.g. "فایل صوتی"
            $table->boolean('is_required')->default(false);
            $table->json('allowed_mime_types')->nullable();   // null = use the collection's defaults
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['blog_category_id', 'collection_name'], 'cat_media_req_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_media_requirements');
    }
};
