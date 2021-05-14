<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAlertsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();

            $table->morphs('alertable'); //->comment('alertable - id of parent entity (activity/request/contact/etc)');

            $table->string('alert_template_id')->nullable()->comment('id of related alert template');

            $table->string('sms')->comment('phone number to which the alert was sent');
            $table->string('email')->comment('email address to which the alert was sent');
            $table->string('subject')->comment('subject of the alert');
            $table->string('body')->comment('body of the alert');

            $table->foreignId('user_id')->constrained()->comment('id of the user to which the alert belongs');
            $table->string('owner_id')->comment('id of admin user who "owns" the alert (is addressing it)');
            $table->string('request_role_id')->comment('id of related request role');
            $table->string('dismissed_by_id')->nullable()->comment('id of admin user who dismissed the alert');
            $table->dateTime('dismissed_at')->nullable()->comment('timestamp when the alert was dismissed');
            $table->dateTime('sent_at')->nullable()->comment('timestamp when the alert was successfully sent');

            $table->integer('priority')->comment('priority of alert (0=urgent, 1=high, 2=medium, 3=low)');

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
        Schema::dropIfExists('alerts');
    }
}
