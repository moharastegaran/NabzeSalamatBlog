<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    private const LIMITS_KB = [
        'image'    => 10 * 1024,   // 10 MB
        'video'    => 200 * 1024,  // 200 MB
        'audio'    => 50 * 1024,   // 50 MB
        'document' => 20 * 1024,   // 20 MB
    ];

    public function index(Request $request): Response
    {
        $assets = Asset::query()
            ->when($request->type, fn ($q) => $q->where('type', $request->type))
            ->latest()
            ->paginate(24);

        return Inertia::render('Assets/Index', [
            'assets'  => $assets,
            'filters' => $request->only('type'),
        ]);
    }

    public function data(Request $request): JsonResponse
    {
        $assets = Asset::query()
            ->when($request->type && $request->type !== 'all', fn ($q) => $q->where('type', $request->type))
            ->when($request->search, fn ($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->latest()
            ->limit(120)
            ->get();

        return response()->json($assets);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => [
                'required', 'file', 'max:204800',
                'mimetypes:image/jpeg,image/png,image/gif,image/webp,image/svg+xml,' .
                    'video/mp4,video/quicktime,video/x-msvideo,video/webm,video/x-matroska,' .
                    'audio/mpeg,audio/wav,audio/aac,audio/ogg,audio/flac,audio/x-flac,' .
                    'application/pdf,application/msword,' .
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' .
                    'application/vnd.ms-excel,' .
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' .
                    'text/plain',
            ],
            'alt' => ['nullable', 'string', 'max:255'],
        ]);

        $file   = $request->file('file');
        $mime   = $file->getMimeType();
        $type   = Asset::typeFromMime($mime);
        $sizeKb = (int) ceil($file->getSize() / 1024);

        if ($sizeKb > self::LIMITS_KB[$type]) {
            $mb = self::LIMITS_KB[$type] / 1024;
            return back()->withErrors(['file' => "حداکثر حجم فایل از نوع {$type} برابر {$mb} مگابایت است."]);
        }

        $path = $file->store("assets/{$type}s", 'public');

        Asset::create([
            'name'      => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'file_name' => $file->getClientOriginalName(),
            'path'      => $path,
            'disk'      => 'public',
            'mime_type' => $mime,
            'size'      => $file->getSize(),
            'type'      => $type,
            'alt'       => $request->alt,
        ]);

        return back()->with('success', 'فایل با موفقیت آپلود شد.');
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        Storage::disk($asset->disk)->delete($asset->path);
        $asset->delete();

        return back()->with('success', 'فایل با موفقیت حذف شد.');
    }
}
