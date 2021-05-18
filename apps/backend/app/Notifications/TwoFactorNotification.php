<?php

namespace App\Notifications;

use App\Channels\Messages\SmsMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TwoFactorNotification extends Notification
{
    use Queueable;

    protected $code;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($code)
    {
        $this->code = $code;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @todo use twofactor method to determine this if sms is used
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return 'email' === $notifiable->twofactor_method ? ['mail'] : ['sms'];
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
            ->subject('Log In Security')
            ->greeting(sprintf('Hello %s!', $notifiable->full_name))
            ->line(sprintf('This is your authentication code: %s', $this->code))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return MailMessage
     */
    public function toSms($notifiable)
    {
        return (new SmsMessage)
            ->content(sprintf('This is your authentication code: %s', $this->code));
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
            //
        ];
    }

    public function getCode()
    {
        return $this->code;
    }
}
