<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('breaking_news');
    }

    public function down(): void
    {
        Schema::create('breaking_news', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('active_from')->nullable();
            $table->timestamp('active_until')->nullable();
            $table->timestamps();
        });
    }
};
