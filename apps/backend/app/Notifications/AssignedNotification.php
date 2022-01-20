<?php

namespace App\Notifications;

use App\Models\Request;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssignedNotification extends Notification
{
    use Queueable;

    protected $request;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        $prefs = $notifiable->notification_prefs ?? [];
        $prefs[] = 'database';

        return $prefs;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line('You have been assigned a new assessment.')
            ->action('View detail: ', config('app.frontend_url') . '/assessment/' . $this->request->uuid)
            ->line('Thank you.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'request_id' => $this->request->uuid,
            'title'      => sprintf('New assessment %s.', $this->request->auth_number),
            'message'    => sprintf('Request %s has been assigned to you.', $this->request->auth_number),
            'priority'   => 3, // warning
            'action'     => ['title' => 'View Request', 'url' => '/assessment/' . $this->request->uuid],
        ];
    }
}
