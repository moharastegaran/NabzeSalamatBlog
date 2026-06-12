<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvincesCitiesSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('cities')->truncate();
        DB::table('provinces')->truncate();

        foreach (['provinces.sql' => 'provinces', 'cities.sql' => 'cities'] as $file => $table) {
            $sql = file_get_contents(base_path($file));

            // Extract only INSERT statements
            preg_match_all('/INSERT INTO\s+`?' . $table . '`?\s+.*?;/si', $sql, $matches);

            foreach ($matches[0] as $insert) {
                DB::unprepared($insert);
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
}
