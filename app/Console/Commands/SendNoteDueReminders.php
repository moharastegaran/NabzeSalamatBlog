<?php

namespace App\Console\Commands;

use App\Models\Note;
use App\Notifications\NoteDueReminder;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SendNoteDueReminders extends Command
{
    protected $signature   = 'notes:remind';
    protected $description = 'Send reminders for notes due in 2 days';

    public function handle(): int
    {
        $target = Carbon::today()->addDays(2)->toDateString();

        $notes = Note::with('user')
            ->where('due_date', $target)
            ->where('is_done', false)
            ->whereNull('reminder_sent_at')
            ->get();

        foreach ($notes as $note) {
            $note->user->notify(new NoteDueReminder($note));
            $note->update(['reminder_sent_at' => now()]);
        }

        $this->info("Reminded {$notes->count()} note(s) due on {$target}.");

        return self::SUCCESS;
    }
}
