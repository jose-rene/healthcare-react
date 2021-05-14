<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConsultantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /**
         * this is to act like a pivot/join table
         */
        Schema::create('consultants', function (Blueprint $table) {
            $table->id();

            $table->foreignId('request_id')->comment('id of parent request');
            $table->foreignId('clinician_id')->comment('id of parent request');
            $table->foreignId('clinical_user_id')->comment('id of related clinical user');

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
        Schema::dropIfExists('consultants');
    }
}
