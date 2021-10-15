<?php

namespace App\Jobs;

use App\Models\FormAnswer;
use App\Models\RequestFormSection;
use Carbon\Carbon;
use Illuminate\Foundation\Bus\Dispatchable;

class CheckFormAnswersJob
{
    use Dispatchable;

    public RequestFormSection $form_answer;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(RequestFormSection $form_answer)
    {
        $this->form_answer = $form_answer;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $answers = $this->form_answer;
        $form    = $answers->form;
        $fields  = $form->fields;

        $is_complete = true;

        foreach ($fields as $field) {
            $custom_name    = $field['custom_name'];
            $field_required = $field['required'] ?? false;

            // run all the validations here.
            // TODO :: Maybe use blade with yup to check server side
            if ($field_required && !$answers[$custom_name]) {
                $is_complete = false;

                break;
            }
        }

        if ($is_complete) {
            $answers->update(['completed_at' => Carbon::now()]);
        }
    }
}
