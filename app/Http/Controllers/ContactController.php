<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'phone_number' => ['required', 'string', 'regex:/^(\+98|0)?9\d{9}$/', 'max:20'],
            'email'        => ['nullable', 'email', 'max:255'],
            'subject'      => ['required', 'string', 'min:3', 'max:200'],
            'message'      => ['required', 'string', 'min:10', 'max:2000'],
            'attachment'   => ['nullable', 'file', 'max:2048', 'mimes:jpg,jpeg,png,pdf,doc,docx'],
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('contact-attachments', 'private');
        }

        ContactMessage::create([
            'phone_number'    => $data['phone_number'],
            'email'           => $data['email'] ?? null,
            'subject'         => $data['subject'],
            'message'         => $data['message'],
            'attachment_path' => $attachmentPath,
        ]);

        return back()->with('success', 'پیام شما با موفقیت ارسال شد. در اسرع وقت با شما تماس خواهیم گرفت.');
    }
}
