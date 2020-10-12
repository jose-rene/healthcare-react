<?php

namespace App\Http\Requests\Assessment;

use App\Library\Validation\Factory as ValidationFactory;
use App\Models\Assessment\Questionnaire;
use Illuminate\Foundation\Http\FormRequest;

class AssessmentRequest extends FormRequest
{
    protected $rules = [];

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return $this->getValidations($this->get('questionnaire_id'));
    }

    public function messages()
    {
        return $this->getValidationMessages($this->get('questionnaire_id'));
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // dd($validator->errors()->getMessages());
            foreach ($validator->errors()->getMessages() as $key => $item) {
                // echo $key, "\n";
                // var_dump($item);
            }
        });
    }

    /**
     * Get the validator instance for the request using custom factory.
     *
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function getValidatorInstance()
    {
        if ($this->validator) {
            return $this->validator;
        }
        $factory = $this->container->make(ValidationFactory::class);

        $validator = $this->createDefaultValidator($factory);
        if (method_exists($this, 'withValidator')) {
            $this->withValidator($validator);
        }

        $this->setValidator($validator);

        return $this->validator;
    }

    /**
     * Return an array of validations rules by input.
     *
     * @param  int $questionnaireId
     * @return array $validations
     */
    protected function getValidations($questionnaireId)
    {
        $questions = $this->getQuestions($questionnaireId);
        $validations = [];
        // build the validation rules
        foreach ($questions as $item) {
            // inputs are named in this convention by question id
            $validations['input_'.$item['id']] = $item['required'] ? 'bail|required' : 'nullable|regex:/[A-Za-z]+/'; // regex:/[A-Za-z]+/
        }
        // dd($validations);
        return $validations;
    }

    /**
     * Return an array of validations rules by input.
     *
     * @param  int $questionnaireId
     * @return array $validations
     */
    protected function getValidationMessages($questionnaireId)
    {
        $questions = $this->getQuestions($questionnaireId);
        $messages = [];
        // build the validation rules
        foreach ($questions as $item) {
            if ($item['required']) {
                $messages['input_'.$item['id'].'.required'] = sprintf('%s is a required field', $item['name']);
            }
        }
        // dd($messages);

        return $messages;
    }

    /**
     * Return an array of validations rules by input.
     *
     * @param  int $questionnaireId
     * @return array $validations
     */
    protected function getQuestions($questionnaireId)
    {
        // get collection of sections for the relevant questionnaire
        $sections = Questionnaire::findOrFail($questionnaireId)->sections;
        // get questions
        return $sections
            ->map(fn ($section)    => $section->questions)
            ->filter(fn ($section) => $section->count() > 0)
            ->flatten();
    }
}
