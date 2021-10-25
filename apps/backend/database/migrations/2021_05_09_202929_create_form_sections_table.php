<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormSectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('form_sections', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('assessment_id')->nullable()->comment('id of the related assessment');
            $table->bigInteger('form_id')->nullable()->comment('id of the related form');

            $table->string('description')->comment('description');
            $table->string('url')->comment('associated Cognito form url')->nullable();

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
        Schema::dropIfExists('form_sections');
    }
}
