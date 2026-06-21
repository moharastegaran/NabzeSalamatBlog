<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->string('short_link', 6)->nullable()->unique()->after('views');
        });

        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $used  = [];

        DB::table('blog_posts')->whereNull('short_link')->orderBy('id')->each(function ($post) use ($chars, &$used) {
            do {
                $alpha = '';
                for ($i = 0; $i < 5; $i++) {
                    $alpha .= $chars[random_int(0, strlen($chars) - 1)];
                }
                $code = $alpha . random_int(1, 9);
            } while (isset($used[$code]));

            $used[$code] = true;
            DB::table('blog_posts')->where('id', $post->id)->update(['short_link' => $code]);
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn('short_link');
        });
    }
};
