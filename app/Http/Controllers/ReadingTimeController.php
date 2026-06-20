<?php

namespace App\Http\Controllers;

use App\Models\BlogPostView;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redis;

class ReadingTimeController extends Controller
{
    /**
     * Receives a sendBeacon payload with {token, seconds}.
     *
     * If the view row has already been synced to MySQL, update it directly.
     * If the sync job hasn't run yet, store in Redis so the next sync
     * picks it up when it inserts the row.
     */
    public function store(Request $request): Response
    {
        $data = $request->validate([
            'token'   => ['required', 'string', 'size:36'],
            'seconds' => ['required', 'integer', 'min:1', 'max:86400'],
        ]);

        $updated = BlogPostView::where('token', $data['token'])
            ->whereNull('reading_seconds')
            ->update(['reading_seconds' => $data['seconds']]);

        if ($updated === 0) {
            // Row not yet synced — park the value in Redis (30-min TTL, well
            // beyond the 5-min sync window).
            Redis::setex('reading_time:' . $data['token'], 1800, $data['seconds']);
        }

        return response('', 204);
    }
}
