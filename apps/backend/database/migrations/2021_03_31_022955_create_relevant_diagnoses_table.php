<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRelevantDiagnosesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('relevant_diagnoses', function (Blueprint $table) {
            $table->id();

            $table->string('code')->comment('icd-10 code');
            $table->string('description')->comment('icd-10 description');
            $table->boolean('is_weighted')->default(true)->comment('boolean value for whether it is a critical factor in clinician evaluation');
            $table->foreignId('request_id')->comment('id of parent request');

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
        Schema::dropIfExists('relevant_diagnoses');
    }
}
