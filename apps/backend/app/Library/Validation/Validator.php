<?php

namespace App\Library\Validation;

use Arr;
use Illuminate\Support\MessageBag;
use Str;

class Validator extends \Illuminate\Validation\Validator
{
    /**
     * Flag to stop the validator after the first attribute failure.
     *
     * @var bool
     */
    protected $stopOnFail = true;

    /**
     * Flag to stop the validator after the first field failure.
     *
     * @var bool
     */
    protected $bailOnFail = false;

    /**
     * Get the attributes and values that were validated.
     *
     * @return array
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function validated()
    {
        if ($this->invalid()) {
            // throw new ValidationException($this);
            // dd($this->failedRules);
        }

        $results = [];

        $missingValue = Str::random(10);

        foreach (array_keys($this->getRules()) as $key) {
            $value = data_get($this->getData(), $key, $missingValue);

            if ($value !== $missingValue) {
                Arr::set($results, $key, $value);
            }
        }

        $data = $this->replacePlaceholders($results);
        $errors = $this->errors()->toArray();
        // get only valid data
        $data = array_filter($data, function ($key) use ($errors) {
            return !isset($errors[$key]);
        }, \ARRAY_FILTER_USE_KEY);

        return $data;
    }

    public function validateInArray($attribute, $value, $parameters)
    {
        return $value == 'foo';
    }

    /**
     * Determine if the data passes the validation rules.
     *
     * @return bool
     */
    public function passes()
    {
        $this->messages = new MessageBag;

        [$this->distinctValues, $this->failedRules] = [[], []];

        // We'll spin through each rule, validating the attributes attached to that
        // rule. Any error messages will be added to the containers with each of
        // the other error messages, returning true if we don't have messages.
        foreach ($this->rules as $attribute => $rules) {
            if ($this->shouldBeExcluded($attribute)) {
                $this->removeAttribute($attribute);

                continue;
            }

            foreach ($rules as $rule) {
                $this->validateAttribute($attribute, $rule);

                if ($this->shouldBeExcluded($attribute)) {
                    $this->removeAttribute($attribute);

                    break;
                }

                if ($this->shouldStopValidating($attribute)) {
                    // stop all validation when an attribute fails
                    if ($this->bailOnFail) {
                        break 2;
                    }
                    // stop validation when an attribute fails
                    if ($this->stopOnFail) {
                        break;
                    }
                    break;
                }
            }
        }

        // Here we will spin through all of the "after" hooks on this validator and
        // fire them off. This gives the callbacks a chance to perform all kinds
        // of other validation that needs to get wrapped up in this operation.
        foreach ($this->after as $after) {
            $after();
        }

        return $this->messages->isEmpty();
    }

    /**
     * Set the stop on fail setting, chainable.
     *
     * @return App\Library\Validation\Validator
     */
    public function setStopOnFail(bool $stopOnFail)
    {
        $this->stopOnFail = $stopOnFail;

        return $this;
    }

    /**
     * Set the bail on fail setting, chainable.
     *
     * @return App\Library\Validation\Validator
     */
    public function setBailOnFail(bool $bail)
    {
        $this->bailOnFail = $bail;

        return $this;
    }
}
