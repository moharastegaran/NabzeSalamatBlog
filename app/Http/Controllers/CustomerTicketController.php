<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CustomerTicketController extends Controller
{
    public function index(): Response
    {
        $tickets = Ticket::where('user_id', Auth::id())
            ->withCount('messages')
            ->when(request('status'), fn ($q) => $q->where('status', request('status')))
            ->orderByRaw("FIELD(status, 'open', 'in_progress', 'closed')")
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Customer/Tickets/Index', [
            'tickets' => $tickets,
            'filters' => request()->only(['status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Customer/Tickets/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'           => ['required', 'string', 'max:255'],
            'department'      => ['required', 'in:technical,financial,support'],
            'body'            => ['required', 'string', 'max:5000'],
            'attachments'     => ['nullable', 'array', 'max:5'],
            'attachments.*'   => ['file', 'max:5120'],
        ]);

        $ticket = Ticket::create([
            'user_id'    => Auth::id(),
            'title'      => $data['title'],
            'department' => $data['department'],
            'priority'   => 'high',
            'status'     => 'open',
        ]);

        $ticket->messages()->create([
            'user_id'  => Auth::id(),
            'body'     => $data['body'],
            'is_staff' => false,
        ]);

        foreach ($request->file('attachments', []) as $file) {
            $ticket->attachments()->create([
                'user_id'       => Auth::id(),
                'original_name' => $file->getClientOriginalName(),
                'path'          => $file->store('ticket-attachments', 'public'),
                'mime_type'     => $file->getMimeType(),
                'size'          => $file->getSize(),
            ]);
        }

        return redirect()->route('customer.tickets.show', $ticket)->with('success', 'تیکت با موفقیت ثبت شد.');
    }

    public function show(Ticket $ticket): Response
    {
        abort_if($ticket->user_id !== Auth::id(), 403);

        $ticket->load(['messages.user', 'attachments']);

        return Inertia::render('Customer/Tickets/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function reply(Request $request, Ticket $ticket): RedirectResponse
    {
        abort_if($ticket->user_id !== Auth::id(), 403);
        abort_if($ticket->status === 'closed', 403, 'تیکت بسته شده است.');

        $data = $request->validate([
            'body'            => ['required', 'string', 'max:5000'],
            'attachments'     => ['nullable', 'array', 'max:5'],
            'attachments.*'   => ['file', 'max:5120'],
        ]);

        $ticket->messages()->create([
            'user_id'  => Auth::id(),
            'body'     => $data['body'],
            'is_staff' => false,
        ]);

        foreach ($request->file('attachments', []) as $file) {
            $ticket->attachments()->create([
                'user_id'       => Auth::id(),
                'original_name' => $file->getClientOriginalName(),
                'path'          => $file->store('ticket-attachments', 'public'),
                'mime_type'     => $file->getMimeType(),
                'size'          => $file->getSize(),
            ]);
        }

        return back()->with('success', 'پیام ارسال شد.');
    }
}
