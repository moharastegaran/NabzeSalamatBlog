<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('category_field_definitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_category_id')->constrained()->cascadeOnDelete();
            $table->string('field_key', 100);        // collection name for 'file'; arbitrary slug for scalars
            $table->string('field_type', 20);        // file | text | number | select | date
            $table->string('label', 100);
            $table->boolean('is_required')->default(false);
            $table->json('options')->nullable();     // file: {allowed_mime_types:[…]}  select: {choices:[{value,label}]}  number: {min,max}
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['blog_category_id', 'field_key'], 'cat_field_def_unique');
        });

        // Migrate existing media requirements → field definitions (field_type = 'file')
        if (Schema::hasTable('category_media_requirements')) {
            $rows = DB::table('category_media_requirements')->get();
            foreach ($rows as $row) {
                $options = null;
                if ($row->allowed_mime_types !== null) {
                    $options = json_encode(['allowed_mime_types' => json_decode($row->allowed_mime_types, true)]);
                }
                DB::table('category_field_definitions')->insert([
                    'blog_category_id' => $row->blog_category_id,
                    'field_key'        => $row->collection_name,
                    'field_type'       => 'file',
                    'label'            => $row->label,
                    'is_required'      => $row->is_required,
                    'options'          => $options,
                    'sort_order'       => $row->sort_order,
                    'created_at'       => $row->created_at,
                    'updated_at'       => $row->updated_at,
                ]);
            }

            Schema::dropIfExists('category_media_requirements');
        }
    }

    public function down(): void
    {
        Schema::create('category_media_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_category_id')->constrained()->cascadeOnDelete();
            $table->string('collection_name');
            $table->string('label');
            $table->boolean('is_required')->default(false);
            $table->json('allowed_mime_types')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['blog_category_id', 'collection_name'], 'cat_media_req_unique');
        });

        // Restore file-type rows back to category_media_requirements
        $rows = DB::table('category_field_definitions')->where('field_type', 'file')->get();
        foreach ($rows as $row) {
            $allowedMimeTypes = null;
            if ($row->options !== null) {
                $opts = json_decode($row->options, true);
                if (isset($opts['allowed_mime_types'])) {
                    $allowedMimeTypes = json_encode($opts['allowed_mime_types']);
                }
            }
            DB::table('category_media_requirements')->insert([
                'blog_category_id'   => $row->blog_category_id,
                'collection_name'    => $row->field_key,
                'label'              => $row->label,
                'is_required'        => $row->is_required,
                'allowed_mime_types' => $allowedMimeTypes,
                'sort_order'         => $row->sort_order,
                'created_at'         => $row->created_at,
                'updated_at'         => $row->updated_at,
            ]);
        }

        Schema::dropIfExists('category_field_definitions');
    }
};
