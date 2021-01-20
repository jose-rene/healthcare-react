<?php

namespace App\Http\Requests\Assessment;

use App\Library\Validation\Factory as ValidationFactory;
use App\Models\Assessment\Answer;
use App\Models\Assessment\Assessment;
use App\Models\Assessment\Questionnaire;
use Arr;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// use Illuminate\Validation\ValidationException;

class AssessmentRequest extends FormRequest
{
    protected $questions = [];

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
     * Get the validated data from the request.
     *
     * @return array
     */
    public function validated()
    {
        return $this->validator->validated();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $id = empty($this->assessment) ? $this->get('questionnaire_id') : $this->assessment->questionnaire->id;

        return $this->getValidations($id);
    }

    public function messages()
    {
        $id = empty($this->assessment) ? $this->get('questionnaire_id') : $this->assessment->questionnaire->id;

        return $this->getValidationMessages($id);
    }

    public function errors()
    {
        return $this->getValidatorInstance()->errors();
    }

    /**
     * Save answer data for assessment.
     *
     * @param App\Models\Assessment\Assessment $assessment
     * @param array $data
     * @return void
     */
    public function saveAnswers(Assessment $assessment, array $data)
    {
        $questions = $this->getQuestions($assessment->questionnaire->id)->toArray();
        // var_dump($data);
        foreach ($data as $key => $value) {
            $id = str_replace('input_', '', $key);
            $question = Arr::first(array_filter($questions, function ($data) use ($id) {
                return $id == $data['id'];
            }));
            // get answer by assessment id and question id
            $params = ['question_id' => $question['id'], 'assessment_id' => $assessment->id];
            $answer = Answer::where($params)
                ->firstOrNew($params);
            if (null === $answer->question) {
                // attach question and assessment
                $answer->question()->associate($question['id']);
                $answer->assessment()->associate($assessment);
            }
            // save the answer
            $answer->answer = $value;
            // save the valuelist item, this may not be necessary
            if (!empty($answer->question->valuelist)) {
                $listitems = $answer->question->valuelist->listitems->toArray();
                $selected = Arr::first(array_filter($listitems, function ($item) use ($value) {
                    return $value == $item['val'];
                }));
                if (!empty($selected)) {
                    $answer->listitem_id = $selected['id'];
                }
            }
            $answer->save();
        }
    }

    /**
     * Handle a failed validation attempt.
     *
     * This is called when the class is resolved from FormProvider, do nothing here and handle it in validated.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return array
     */
    protected function failedValidation(Validator $validator)
    {
        /*$exception = new ValidationException($validator);
        // return a regular 200 status
        $exception->status = 200;
        throw ($exception)
                    ->errorBag($this->errorBag)
                    ->redirectTo($this->getRedirectUrl());*/
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
            $validations[$key = 'input_' . $item['id']] = [];
            $validations[$key][] = $item['required'] ? 'required' : ['nullable', 'regex:/[A-Za-z]+/'];
            if (null !== $item->valuelist) {
                // $validations[$key][] = new InArray($item->valuelist->listitems->toArray());
                // get possible list item values
                $values = array_map(function ($listitem) {
                    return $listitem['val'];
                }, $item->valuelist->listitems->toArray());
                // add validation
                // dd(Rule::in($values)->__toString());
                $validations[$key][] = Rule::in($values);
            }
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
                $messages['input_' . $item['id'] . '.required'] = sprintf('%s is a required field', $item['name']);
            }
            if (null !== $item->valuelist) {
                $messages['input_' . $item['id'] . '.in'] = sprintf('%s does not contain a valid entry', $item['name']);
            }
        }

        return $messages;
    }

    /**
     * Return an array of validations rules by input.
     *
     * @param  int $questionnaireId
     * @return \Illuminate\Support\Collection $questions
     */
    protected function getQuestions($questionnaireId)
    {
        if (!empty($this->questions[$questionnaireId])) {
            return $this->questions[$questionnaireId];
        }
        // get collection of sections for the relevant questionnaire
        $sections = Questionnaire::findOrFail($questionnaireId)->sections;
        // get questions
        return $this->questions[$questionnaireId] = $sections
            ->map(fn ($section)    => $section->questions)
            ->filter(fn ($section) => $section->count() > 0)
            ->flatten();
    }
}
