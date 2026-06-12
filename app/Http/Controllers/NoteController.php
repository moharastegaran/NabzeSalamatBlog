<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NoteController extends Controller
{
    public function index(): Response
    {
        $notes = Note::where('user_id', auth()->id())
            ->orderBy('is_done')
            ->orderByDesc('created_at')
            ->get(['id', 'body', 'is_done', 'due_date', 'created_at']);

        return Inertia::render('Notes/Index', ['notes' => $notes]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'body'     => ['required', 'string', 'max:500'],
            'due_date' => ['nullable', 'date'],
        ]);

        Note::create([
            'user_id'  => auth()->id(),
            'body'     => $data['body'],
            'is_done'  => false,
            'due_date' => $data['due_date'] ?? null,
        ]);

        return back();
    }

    public function toggle(Note $note): RedirectResponse
    {
        abort_if($note->user_id !== auth()->id(), 403);

        $note->update(['is_done' => ! $note->is_done]);

        return back();
    }

    public function destroy(Note $note): RedirectResponse
    {
        abort_if($note->user_id !== auth()->id(), 403);

        $note->delete();

        return back();
    }
}
