<?php

namespace App\Notifications;

use App\Models\Note;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NoteDueReminder extends Notification
{
    use Queueable;

    public function __construct(private Note $note) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'note_id' => $this->note->id,
            'message' => "یادداشت «{$this->note->body}» تا ۲ روز دیگر سررسید می‌شود.",
        ];
    }
}
