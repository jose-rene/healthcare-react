<?php

namespace App\Jobs\Admin;

use App\Models\Assessment;
use App\Models\Request;
use Illuminate\Foundation\Bus\Dispatchable;
use Symfony\Component\HttpKernel\Exception\HttpException;

class RequestAssessmentJob
{
    use Dispatchable;

    protected $assessment;
    protected $request;

    /**
     * Create a new job instance.
     * 
     * @param App\Models\Request $request
     * @param App\Models\Assessment $assessment
     *
     * @return void
     */
    public function __construct(Request $request, Assessment $assessment)
    {
        $this->assessment = $assessment;
        $this->request = $request;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if ($this->request->requestFormSections && $this->request->requestFormSections->count()) {
            // there is already an attached assessent
            return;
        }
        // check if there are no forms
        if (!$this->assessment->forms || !$this->assessment->forms->count()) {
            throw new HttpException('The assessment has no forms attached.', 422);
        }
        // create the request form sections from the forms linked to this assessment
        $this->assessment->forms->each(function($form) {
            $this->request->requestFormSections()->create(
                [
                    'form_section_id' => $form->pivot->id,
                    'answer_data'     => [],
                ]
            );
        });
        $this->request->refresh();
    }
}
