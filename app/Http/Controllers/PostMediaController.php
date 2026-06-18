<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\PostMedia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class PostMediaController extends Controller
{
    private const SIZE_LIMITS = [
        'audio'      => 1024 * 50,   // 50 MB
        'video'      => 1024 * 200,  // 200 MB
        'transcript' => 1024 * 20,   // 20 MB
        'attachment' => 1024 * 20,   // 20 MB
    ];

    public function store(Request $request, BlogPost $blog): RedirectResponse
    {
        $request->validate([
            'collection_name' => ['required', 'string', 'in:' . implode(',', array_keys(BlogPost::MEDIA_COLLECTIONS))],
            'file'            => ['required', 'file'],
        ]);

        $collection = $request->input('collection_name');
        $requirement = $blog->category?->mediaRequirements()
            ->where('collection_name', $collection)
            ->first();

        $allowedMimes = $requirement?->effectiveMimeTypes()
            ?? BlogPost::MEDIA_COLLECTIONS[$collection]
            ?? null;

        $maxKb = self::SIZE_LIMITS[$collection] ?? 1024 * 20;

        $rules = ['required', 'file', "max:{$maxKb}"];
        if ($allowedMimes) {
            $rules[] = 'mimetypes:' . implode(',', $allowedMimes);
        }

        $request->validate(['file' => $rules], [
            'file.mimetypes' => 'نوع فایل مجاز نیست. فرمت‌های مجاز: ' . implode('، ', $allowedMimes ?? []),
            'file.max'       => 'حجم فایل بیش از حد مجاز است.',
        ]);

        $file     = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $path     = $file->store("post-media/{$collection}/{$blog->id}", 'public');

        PostMedia::create([
            'model_type'      => BlogPost::class,
            'model_id'        => $blog->id,
            'collection_name' => $collection,
            'name'            => pathinfo($fileName, PATHINFO_FILENAME),
            'file_name'       => $fileName,
            'path'            => $path,
            'disk'            => 'public',
            'mime_type'       => $file->getMimeType(),
            'size'            => $file->getSize(),
            'order_column'    => $blog->getMedia($collection)->count(),
        ]);

        return back()->with('success', 'فایل با موفقیت بارگذاری شد.');
    }

    public function destroy(BlogPost $blog, PostMedia $media): RedirectResponse
    {
        abort_unless($media->model_type === BlogPost::class && $media->model_id === $blog->id, 404);

        Storage::disk($media->disk)->delete($media->path);
        $media->delete();

        return back()->with('success', 'فایل حذف شد.');
    }
}
