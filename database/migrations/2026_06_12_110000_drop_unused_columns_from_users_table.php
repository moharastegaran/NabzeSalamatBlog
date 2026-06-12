<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['supervisor_id']);
            $table->dropColumn([
                'supervisor_id',
                'sales_sno',
                'is_withdrawal',
                'postal_code',
                'landline_phone',
                'description',
                'birth_date',
                'cooperation_started_at',
                'education_level',
                'address',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedBigInteger('sales_sno')->nullable();
            $table->boolean('is_withdrawal')->default(false);
            $table->string('postal_code', 10)->nullable();
            $table->string('landline_phone', 11)->nullable();
            $table->text('description')->nullable();
            $table->date('birth_date')->nullable();
            $table->timestamp('cooperation_started_at')->nullable();
            $table->enum('education_level', ['illiterate', 'diploma', 'post_graduate', 'associate', 'bachelor', 'masters', 'phd', 'postdoc'])->nullable();
            $table->text('address')->nullable();
        });
    }
};
