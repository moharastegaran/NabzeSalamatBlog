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

        $adminUser = User::firstOrCreate(
            ['email' => 'admin@nabzesalamat.test'],
            ['name' => 'محمدرضا رستگاران', 'password' => Hash::make('password'), 'mobile' => '09057507969', 'melli_code' => '1742714439']
        );
        $adminUser->syncRoles('admin');

        $this->call(BlogPostsSeeder::class);
        $this->call(PostImagesSeeder::class);

        $contributorUser = User::firstOrCreate(
            ['email' => 'contributor@nabzesalamat.test'],
            ['name' => 'کاربر مشارکت کننده', 'password' => Hash::make('password'), 'mobile' => '09128765432']
        );
        $contributorUser->syncRoles('contributor');

        $writerUser = User::firstOrCreate(
            ['email' => 'writer@nabzesalamat.test'],
            ['name' => 'کاربر نویسنده', 'password' => Hash::make('password'), 'mobile' => '09214856002']
        );
        $writerUser->syncRoles('writer');
    }
}
