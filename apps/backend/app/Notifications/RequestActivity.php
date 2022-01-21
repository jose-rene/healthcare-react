<?php

namespace App\Notifications;

use App\Channels\Messages\SmsMessage;
use App\Models\Activity\Activity;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Route;

class RequestActivity extends Notification
{
    use Queueable;

    protected $activity;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Activity $activity)
    {
        $this->activity = $activity;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        $prefs = $notifiable->notificationSettings;
        $prefs[] = 'database';

        return $prefs;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line($this->activity->message)
            ->action('View detail: ', config('app.frontend_url') . '/activity/' . $this->activity->uuid)
            ->line('Thank you.');
    }

    /**
     * Get the SMS representation of the notification.
     *
     * @param mixed $notifiable
     * @return SmsMessage
     */
    public function toSms($notifiable)
    {
        return (new SmsMessage)
            ->content('You have a new activity, view detail ' . Route::frontendUrl('/activity/' . $this->activity->uuid));
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return $this->getActivityData();
    }

    public function getActivityData()
    {
        return $this->activity->toArray() + ['action' => ['title' => 'View Activity', 'url' => '/activity/' . $this->activity->uuid]];
    }
}
