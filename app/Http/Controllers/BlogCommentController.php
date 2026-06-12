<?php

namespace App\Http\Controllers;

use App\Models\BlogComment;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogCommentController extends Controller
{
    // Dashboard: moderation list
    public function index(): Response
    {
        $comments = BlogComment::with('post:id,title,slug')
            ->latest()
            ->paginate(30);

        return Inertia::render('Blog/Comments', ['comments' => $comments]);
    }

    // Dashboard: approve a comment
    public function approve(BlogComment $blogComment): RedirectResponse
    {
        $blogComment->update(['is_approved' => true]);

        return back()->with('success', 'نظر تأیید شد.');
    }

    // Dashboard: delete a comment
    public function destroy(BlogComment $blogComment): RedirectResponse
    {
        $blogComment->delete();

        return back()->with('success', 'نظر حذف شد.');
    }

    // Shop: submit a new comment
    public function store(Request $request, BlogPost $post): JsonResponse
    {
        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'body'  => ['required', 'string', 'max:2000'],
        ]);

        $post->comments()->create($validated);

        return response()->json(['message' => 'نظر شما پس از تأیید نمایش داده می‌شود.']);
    }
}
