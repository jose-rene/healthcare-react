<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToRequestsFromPlanning extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->unsignedBigInteger('request_type_id')->nullable();            // fk to request types table
            $table->unsignedBigInteger('clinician_id')->nullable();               //fk clinical_services_users.id
            $table->unsignedBigInteger('reviewer_id')->nullable();                //fk clinical_services_users.id
            $table->unsignedBigInteger('therapy_network_id')->nullable();         // fk to therapy networks table
            $table->unsignedBigInteger('hp_user_id')->nullable();                 //fk health_plan_users.id
            $table->unsignedBigInteger('payer_user_id')->nullable();              //fk payer.id
            $table->unsignedBigInteger('request_status_id')->nullable();          //fk request_status.id
            $table->unsignedBigInteger('questionnaire_id')->nullable();           //fk questionnaire.id
            $table->unsignedBigInteger('auth_number')->nullable();
            $table->unsignedBigInteger('auth_payer_uniqueness')->nullable();
            $table->unsignedBigInteger('member_payer_history_id')->nullable(); // fk to member payer history
            $table->unsignedBigInteger('member_address_id')->nullable();       // fk to addresses.id
            $table->unsignedBigInteger('payer_id')->nullable();                // fk to addresses.id
            $table->dateTime('due_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->dropColumn('request_type_id',
                'clinician_id',
                'reviewer_id',
                'therapy_network_id',
                'hp_user_id',
                'member_payer_history_id',
                'due_at'
            );
        });
    }
}
