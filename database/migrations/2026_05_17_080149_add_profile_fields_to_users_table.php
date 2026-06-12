<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('melli_code', 10)->nullable()->unique()->after('mobile');
            $table->string('landline_phone', 10)->nullable()->after('melli_code');
            $table->text('address')->nullable()->after('landline_phone');
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete()->after('address');
            $table->timestamp('cooperation_started_at')->nullable()->after('city_id');
            $table->enum('education_level', ['illiterate', 'diploma', 'post_graduate', 'associate', 'bachelor', 'masters', 'phd', 'postdoc'])->nullable()->after('cooperation_started_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['city_id']);
            $table->dropColumn(['melli_code', 'landline_phone', 'address', 'city_id', 'cooperation_started_at', 'education_level']);
        });
    }
};
