<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingDocumentsTable extends Migration
{
    public function up()
    {
        Schema::create('training_documents', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');

            $table->nullableMorphs('documentable');
            $table->foreignId('training_document_type_id')->constrained()->comment('Training document type like Compliance Polices Procedures or Portal Training');
            $table->unsignedBigInteger('payer_id')->nullable()->comment('If null this training document is generic/ global');
            $table->string('name')->comment('Original file name');
            $table->string('mime_type')->comment('File type for example application/pdf');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('training_documents');
    }
}
