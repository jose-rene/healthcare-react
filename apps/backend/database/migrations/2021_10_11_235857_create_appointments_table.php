<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppointmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->comment('the associated request');
            $table->foreignId('clinician_id')->constrained('users')->comment('id of the associated clinician');
            $table->boolean('is_scheduled')->default(0)->comment('flag was appointment scheduled');
            $table->boolean('is_reschedule')->default(0)->comment('flag is a rescheduled appointment');
            $table->boolean('is_cancelled')->default(0)->comment('flag is appointment cancelled');
            $table->date('called_at')->nullable()->comment('date the member was called');
            $table->string('reason')->nullable()->comment('reason appointment was not scheduled');
            $table->string('cancel_reason')->nullable('reason the appointment was cancelled');
            $table->string('comments')->nullable()->comment('comments');
            $table->date('appointment_date')->nullable()->comment('the appointment date');
            $table->date('canceled_at')->nullable()->comment('date appt was cancelled');
            $table->string('start_time')->nullable()->comment('the appointment window start');
            $table->string('end_time')->nullable()->comment('the appointment window end');

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
        Schema::dropIfExists('appointments');
    }
}
