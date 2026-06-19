<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->query('filter', 'all'); // all | unread
        $search = trim($request->query('search', ''));

        $query = ContactMessage::query()
            ->when($filter === 'unread', fn ($q) => $q->whereNull('read_at'))
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('phone_number', 'like', "%{$search}%")
                  ->orWhere('subject',      'like', "%{$search}%")
                  ->orWhere('email',        'like', "%{$search}%");
            }))
            ->latest();

        $messages = $query->paginate(20)->withQueryString();

        $unreadCount = ContactMessage::whereNull('read_at')->count();

        return Inertia::render('ContactMessages/Index', [
            'messages'    => $messages,
            'unreadCount' => $unreadCount,
            'filters'     => ['filter' => $filter, 'search' => $search],
        ]);
    }

    public function markRead(ContactMessage $message): RedirectResponse
    {
        if (! $message->read_at) {
            $message->update(['read_at' => now()]);
        }

        return back()->with('success', 'پیام به عنوان خوانده‌شده علامت‌گذاری شد.');
    }

    public function destroy(ContactMessage $message): RedirectResponse
    {
        if ($message->attachment_path) {
            Storage::disk('private')->delete($message->attachment_path);
        }
        $message->delete();

        return back()->with('success', 'پیام حذف شد.');
    }

    public function download(ContactMessage $message)
    {
        abort_if(! $message->attachment_path, 404);
        abort_unless(Storage::disk('private')->exists($message->attachment_path), 404);

        return Storage::disk('private')->download($message->attachment_path);
    }
}
