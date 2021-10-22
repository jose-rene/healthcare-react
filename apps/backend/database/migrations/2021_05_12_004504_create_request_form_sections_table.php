<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestFormSectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_form_sections', function (Blueprint $table) {
            $table->id();

            $table->json('answer_data')->comment('answer data in JSON format');
            $table->foreignId('form_section_id')->comment('id of the related form_section');
            $table->foreignId('request_id')->comment('id of parent request');

            $table->dateTime('completed_at')->nullable();
            $table->dateTime('started_at')->nullable();

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
        Schema::dropIfExists('request_form_sections');
    }
}
