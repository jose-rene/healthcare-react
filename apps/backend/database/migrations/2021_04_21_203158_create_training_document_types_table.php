<?php

use App\Models\TrainingDocumentType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingDocumentTypesTable extends Migration
{
    public function up()
    {
        Schema::create('training_document_types', function (Blueprint $table) {
            $table->id();

            $table->string('name', 50)->comment('Document type name');

            $table->timestamps();
            $table->softDeletes();
        });

        $types = [
            'Compliance Polices Procedures',
            'Portal Training',
            'Resources',
        ];

        foreach ($types as $type) {
            TrainingDocumentType::create(['name' => $type]);
        }
    }

    public function down()
    {
        Schema::dropIfExists('training_document_types');
    }
}
