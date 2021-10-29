<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAssessmentRulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('assessment_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->comment('The associated assessment');
            $table->foreignId('payer_id')->nullable()->comment('The associated payer');
            $table->foreignId('classification_id')->nullable()->comment('The associated classification');
            $table->foreignId('request_type_id')->nullable()->comment('The associated request type');
            $table->bigInteger('hcpc_id')->nullable()->comment('The associated hcpc');
            $table->string('name')->comment('The name of the rule');

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
        Schema::dropIfExists('assessment_rules');
    }
}
