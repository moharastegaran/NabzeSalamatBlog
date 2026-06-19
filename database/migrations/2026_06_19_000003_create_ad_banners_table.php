<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ad_banners', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('image', 500)->nullable();
            $table->string('external_url', 500)->nullable();
            $table->json('locations');   // e.g. ["landing","blogsingle"]
            $table->boolean('is_active')->default(true);
            $table->dateTime('active_from')->nullable();
            $table->dateTime('active_until')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_banners');
    }
};
