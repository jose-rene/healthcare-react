<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index();
            $table->foreignId('member_id')->constrained()->comment('id of related member');
            $table->foreignId('payer_id')->constrained()->comment('id of the member payer info at the time request was created');
            $table->foreignId('payer_user_id')->constrained('users')->comment('id of the payer user that created the request');
            $table->foreignId('member_payer_history_id')->constrained()->comment('The payer history at the time of request creation');
            $table->foreignId('member_address_id')->index()->nullable()->comment('id of the address at the time of request creation');
            $table->foreignId('request_status_id')->index()->nullable()->comment('The current status of the request');
            $table->string('auth_number', 128)->nullable()->comment('The user assigned Auth # for the request');
            $table->dateTime('member_verified_at')->nullable()->comment('Member information was verified during request entry');

            $table->foreignId('request_type_id')->nullable()->comment('id of the assigned request type');                         // fk to request types table
            $table->foreignId('clinician_id')->nullable()->comment('id of the assigned clinician');                               // fk clinical_services_users.id
            $table->foreignId('reviewer_id')->nullable()->comment('id of the assigned reviewer');                                 // fk clinical_services_users.id
            $table->foreignId('therapy_network_id')->nullable()->comment('id of the therapy network for the assigned clinician'); // fk to therapy networks table
            $table->foreignId('hp_user_id')->nullable();                                                                          // fk health_plan_users.id
            $table->foreignId('questionnaire_id')->nullable();                                                                    // fk questionnaire.id
            $table->foreignId('auth_payer_uniqueness')->nullable();                                                               // fk to member payer history
            $table->foreignId('form_id')->nullable()->comment('id of the associated form');                                       // fk to addresses.id
            $table->dateTime('due_at')->nullable()->comment('The request due date');
            $table->boolean('due_at_na')->default(0)->comment('If n/a was explicitly set for the due date');
            $table->string('note')->nullable();
            $table->double('travel_time_estimate')->nullable();

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
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('requests');
        Schema::enableForeignKeyConstraints();
    }
}
