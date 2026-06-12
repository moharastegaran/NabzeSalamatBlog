<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    private function isAdmin(): bool
    {
        return Auth::user()->hasRole('admin');
    }

    private function canAccess(Ticket $ticket): bool
    {
        return $this->isAdmin()
            || $ticket->user_id    === Auth::id()
            || $ticket->to_user_id === Auth::id();
    }

    public function index(): Response
    {
        $tickets = Ticket::with(['user', 'toUser', 'assignee'])
            ->withCount('messages')
            ->when(!$this->isAdmin(), fn ($q) => $q->where(function ($q) {
                $q->where('user_id', Auth::id())->orWhere('to_user_id', Auth::id());
            }))
            ->when(request('status'),     fn ($q) => $q->where('status',     request('status')))
            ->when(request('department'), fn ($q) => $q->where('department', request('department')))
            ->orderByRaw("FIELD(status, 'open', 'in_progress', 'closed')")
            ->orderByDesc('updated_at')
            ->paginate(20)
            ->withQueryString();

        $staff = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'staff'   => $staff,
            'filters' => request()->only(['status', 'department']),
        ]);
    }

    public function create(): Response
    {
        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Tickets/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'to_user_id'      => ['nullable', 'exists:users,id'],
            'title'           => ['required', 'string', 'max:255'],
            'department'      => ['required', 'in:technical,financial,support'],
            'body'            => ['required', 'string', 'max:5000'],
            'attachments'     => ['nullable', 'array', 'max:5'],
            'attachments.*'   => ['file', 'max:5120'],
        ]);

        $ticket = Ticket::create([
            'user_id'     => Auth::id(),
            'to_user_id'  => $data['to_user_id'] ?? null,
            'assigned_to' => Auth::id(),
            'title'       => $data['title'],
            'department'  => $data['department'],
            'status'      => 'open',
        ]);

        $ticket->messages()->create([
            'user_id'  => Auth::id(),
            'body'     => $data['body'],
            'is_staff' => true,
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

        return redirect()->route('tickets.show', $ticket)->with('success', 'تیکت ایجاد شد.');
    }

    public function show(Ticket $ticket): Response
    {
        if (!$this->canAccess($ticket)) {
            abort(403);
        }

        $ticket->load(['user', 'toUser', 'assignee', 'messages.user', 'attachments.user']);

        $staff = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket,
            'staff'  => $staff,
        ]);
    }

    public function reply(Request $request, Ticket $ticket): RedirectResponse
    {
        if (!$this->canAccess($ticket)) {
            abort(403);
        }

        $data = $request->validate([
            'body'            => ['required', 'string', 'max:5000'],
            'attachments'     => ['nullable', 'array', 'max:5'],
            'attachments.*'   => ['file', 'max:5120'],
        ]);

        $ticket->messages()->create([
            'user_id'  => Auth::id(),
            'body'     => $data['body'],
            'is_staff' => true,
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

        if ($ticket->status === 'open') {
            $ticket->update(['status' => 'in_progress']);
        }

        return back()->with('success', 'پاسخ ثبت شد.');
    }

    public function updateStatus(Request $request, Ticket $ticket): RedirectResponse
    {
        if (!$this->canAccess($ticket)) {
            abort(403);
        }

        $data = $request->validate([
            'status'      => ['required', 'in:open,in_progress,closed'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        $ticket->update([
            'status'      => $data['status'],
            'assigned_to' => array_key_exists('assigned_to', $data) ? $data['assigned_to'] : $ticket->assigned_to,
            'closed_at'   => $data['status'] === 'closed' ? now() : null,
        ]);

        return back()->with('success', 'تیکت بروزرسانی شد.');
    }

    public function destroy(Ticket $ticket): RedirectResponse
    {
        foreach ($ticket->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->path);
        }

        $ticket->delete();

        return redirect()->route('tickets.index')->with('success', 'تیکت حذف شد.');
    }
}
