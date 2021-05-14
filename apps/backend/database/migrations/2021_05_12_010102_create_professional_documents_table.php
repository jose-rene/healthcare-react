<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfessionalDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('professional_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('clinical_user_id')->comment('if of parent clinical user');
            $table->dateTime('date_exp')->comment('expiration date');
            $table->string('document_number')->comment('license#/policy#/etc');
            $table->string('issuing_authority')->comment('issuing authority');
            $table->string('license_type_id')->comment('id of related license type');
            $table->string('object_name')->comment('S3 object name');
            $table->foreignId('professional_document_type_id')->comment('id of related document type');
            $table->string('state')->comment('issuing state');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('professional_documents');
    }
}
