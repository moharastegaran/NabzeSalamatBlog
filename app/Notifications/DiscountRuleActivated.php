<?php

namespace App\Notifications;

use App\Models\Rule;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DiscountRuleActivated extends Notification
{
    use Queueable;

    public function __construct(private Rule $rule) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'rule_id'   => $this->rule->id,
            'rule_name' => $this->rule->name,
            'message'   => "قانون تخفیف «{$this->rule->name}» فعال شد.",
        ];
    }
}
