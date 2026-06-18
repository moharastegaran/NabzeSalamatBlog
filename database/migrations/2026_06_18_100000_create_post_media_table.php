<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_media', function (Blueprint $table) {
            $table->id();
            $table->morphs('model');                          // model_type + model_id + index
            $table->string('collection_name');
            $table->string('name');
            $table->string('file_name');
            $table->string('path');
            $table->string('disk', 20)->default('public');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size');
            $table->json('custom_properties')->nullable();    // duration, bitrate, codec, dimensions…
            $table->unsignedSmallInteger('order_column')->default(0);
            $table->timestamps();

            $table->index(['model_type', 'model_id', 'collection_name'], 'post_media_model_collection');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_media');
    }
};
