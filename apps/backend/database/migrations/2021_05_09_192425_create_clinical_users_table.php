<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClinicalUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clinical_users', function (Blueprint $table) {
            $table->id();

            $table->foreignId('clinical_type_id')->comment('id of clinical type (PT/OT/LPN/etc)');
            $table->foreignId('clinical_user_status_id')->comment('id of status record (active/available/unavailable/probation/vacation/etc)');
            $table->foreignId('clinical_user_type_id')->comment('id of clinical user type (clinician/reviewer/senior reviewer/etc)');
            $table->dateTime('date_hired')->nullable()->comment('date first activated');
            $table->boolean('is_preferred')->default(false)->comment('flag for preferred clinician (when assigning)');
            $table->boolean('is_test')->default(false)->comment('boolean flag for test record');
            $table->string('note')->default('')->comment('clinician note');
            $table->foreignId('therapy_network_id')->nullable()->comment('id of parent therapy network');
            $table->string('title')->default('')->comment('job title');
            $table->foreignId('user_id')->constrained()->comment('id of related user record');

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
        Schema::dropIfExists('clinical_users');
    }
}
