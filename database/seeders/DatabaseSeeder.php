<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(PermissionsSeeder::class);
        $this->call(BlogPostsSeeder::class);

        $adminUser = User::firstOrCreate(
            ['email' => 'admin@salesportal.test'],
            ['name' => 'Admin', 'password' => Hash::make('password'), 'mobile' => '09000000000', 'melli_code' => '1742714439']
        );
        $adminUser->syncRoles('admin');

        $contributorUser = User::firstOrCreate(
            ['email' => 'contributor@salesportal.test'],
            ['name' => 'Contributor', 'password' => Hash::make('password'), 'mobile' => '09111111111']
        );
        $contributorUser->syncRoles('contributor');

        $writerUser = User::firstOrCreate(
            ['email' => 'writer@salesportal.test'],
            ['name' => 'Writer', 'password' => Hash::make('password'), 'mobile' => '09222222222']
        );
        $writerUser->syncRoles('writer');
    }
}
