<?php

namespace Database\Factories;

use App\Models\TrainingDocument;
use App\Models\TrainingDocumentType;
use Illuminate\Database\Eloquent\Factories\Factory;

class TrainingDocumentFactory extends Factory
{
    protected $model = TrainingDocument::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name'      => $this->faker->name,
            'mime_type' => $this->faker->mimeType,

            'training_document_type_id' => function () {
                return TrainingDocumentType::all()->random()->id;
            },
        ];
    }
}
