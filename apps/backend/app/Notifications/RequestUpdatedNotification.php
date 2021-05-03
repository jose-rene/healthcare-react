<?php

namespace App\Notifications;

use App\Models\Activity\Activity;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\NexmoMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Route;

class RequestUpdatedNotification extends Notification
{
    private Activity $activity;

    public function __construct(Activity $activity)
    {
        $this->activity = $activity;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        $prefs   = $notifiable->notification_prefs ?? [];
        $prefs[] = 'database';

        return $prefs;
    }

    public function toMail($notifiable)
    {
        $message = new MailMessage();
        $message->subject('Request Updated');

        $message->line("Request id {$this->activity->request->uuid} has updated");

        if ($this->activity->message == 'request.updated') {
            foreach ($this->activity->json_message['old'] as $key => $oldValue) {
                $newValue = $this->activity->json_message['new'][$key];

                $message->line("The field \"{$key}\" changed from \"{$oldValue}\" to \"{$newValue}\"");
            }
        }

        $message
            ->action(
                'View detail: ',
                Route::frontendUrl('/healthplan/requests?request_id=' . $this->activity->request->uuid)
            )
            ->line('Thank you.');

        return $message;
    }

    /**
     * Get the Nexmo / SMS representation of the notification.
     *
     * @param mixed $notifiable
     * @return NexmoMessage
     */
    public function toSMS($notifiable)
    {
        return (new NexmoMessage)
            ->content("A request has updated " . Route::frontendUrl('/healthplan/requests?request_id' . $this->activity->json_message['request_id']));
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $rtv = [
            'subject' => "The request id {$this->activity->request->uuid} updated",
            'body'    => [],
            'data'    => [
                'request' => [
                    'id' => $this->activity->request->uuid,
                ],
            ],
        ];

        if ($this->activity->message == 'request.updated') {
            $rtv['action'] = 'request.updated';
            foreach ($this->activity->json_message['old'] as $key => $oldValue) {
                $newValue = $this->activity->json_message['new'][$key];

                $rtv['body'][] = "The field \"{$key}\" changed from \"{$oldValue}\" to \"{$newValue}\"\r\n";
            }
        }

        return $rtv;
    }
}
