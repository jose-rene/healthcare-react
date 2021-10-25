<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAssessmentFormTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('assessment_form', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->comment('the associated assessment');
            $table->foreignId('form_id')->comment('the associated form id, a section in the assessment');
            $table->tinyInteger('position')->unsigned()->default(0)->comment('the position of the form in the assessment');
            $table->string('name')->nullable()->comment('the name, will override form name if present');
            $table->string('description')->nullable()->comment('the description, will override form description if present');
            $table->string('url')->nullable()->comment('a deprecated field for url');

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
        Schema::dropIfExists('assesment_form');
    }
}
