<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\User;
use App\Notifications\AnnouncementBroadcast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        $announcements = Announcement::with('sender')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($a) => [
                'id'          => $a->id,
                'message'     => $a->message,
                'sent_by'     => $a->sender?->name,
                'created_at'  => $a->created_at,
                'recalled_at' => $a->recalled_at,
                'read_count'  => $a->read_count,
            ]);

        $users = User::whereDoesntHave('roles', fn ($q) => $q->where('name', 'customer'))
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'users'         => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'message'    => ['required', 'string', 'max:1000'],
            'is_urgent'  => ['boolean'],
            'user_ids'   => ['nullable', 'array'],
            'user_ids.*' => ['integer', 'exists:users,id', function ($attr, $value, $fail) {
                if (User::where('id', $value)->whereHas('roles', fn ($q) => $q->where('name', 'customer'))->exists()) {
                    $fail('کاربر انتخاب شده مجاز نیست.');
                }
            }],
        ]);

        $announcement = Announcement::create([
            'sent_by'   => auth()->id(),
            'message'   => $data['message'],
            'is_urgent' => $data['is_urgent'] ?? false,
        ]);

        $restricted = !empty($data['user_ids']);

        if ($restricted) {
            $announcement->users()->attach($data['user_ids']);
            $recipients = User::whereIn('id', $data['user_ids'])->get();
        } else {
            $recipients = User::all();
        }

        Notification::send($recipients, new AnnouncementBroadcast($announcement));

        return back()->with('success', 'اطلاعیه با موفقیت ارسال شد.');
    }

    public function recall(Announcement $announcement): RedirectResponse
    {
        abort_if($announcement->recalled_at !== null, 422);

        $announcement->update(['recalled_at' => now()]);

        \DB::table('notifications')
            ->where('type', AnnouncementBroadcast::class)
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.announcement_id')) = ?", [(string) $announcement->id])
            ->whereNull('read_at')
            ->delete();

        return back()->with('success', 'اطلاعیه بازگردانده شد.');
    }
}
