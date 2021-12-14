<?php

namespace App\Notifications;

use App\Interfaces\ReportBuilder;
use App\Models\NarrativeReport;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NarrativeReportNotification extends Notification
{
    use Queueable;

    private NarrativeReport $report;
    private ReportBuilder $reportBuilder;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(NarrativeReport $report, ReportBuilder $reportBuilder)
    {
        $this->report        = $report;
        $this->reportBuilder = $reportBuilder;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable)
    {
        $report        = $this->report;
        $reportBuilder = $this->reportBuilder;

        $pdf = $reportBuilder->htmlToPDF($report->text);

        return (new MailMessage)
            ->subject('test')
            ->line('Thank you for using our application!')
            ->attachData($pdf, 'Narrative Report');
    }
}
