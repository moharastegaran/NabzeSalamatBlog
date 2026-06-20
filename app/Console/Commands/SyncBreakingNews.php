<?php

namespace App\Console\Commands;

use App\Models\BreakingNews;
use Illuminate\Console\Command;

class SyncBreakingNews extends Command
{
    protected $signature   = 'breaking-news:sync';
    protected $description = 'Activate/deactivate breaking news items based on active_from and active_until';

    public function handle(): int
    {
        $now = now();

        // Activate: window has opened but item is still inactive.
        // Exclude items whose window has already closed.
        $activated = BreakingNews::where('is_active', false)
            ->whereNotNull('active_from')
            ->where('active_from', '<=', $now)
            ->where(fn ($q) => $q->whereNull('active_until')->orWhere('active_until', '>', $now))
            ->update(['is_active' => true]);

        // Deactivate: window has closed but item is still active.
        $deactivated = BreakingNews::where('is_active', true)
            ->whereNotNull('active_until')
            ->where('active_until', '<=', $now)
            ->update(['is_active' => false]);

        if ($activated || $deactivated) {
            $this->info("Breaking news synced: {$activated} activated, {$deactivated} deactivated.");
        }

        return self::SUCCESS;
    }
}
