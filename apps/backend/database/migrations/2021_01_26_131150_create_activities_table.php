<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateActivitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->foreign('parent_id')
                ->references('id')
                ->on('activities')
                ->onDelete('set null')
                ->comment('On activity update a new one will be created and reference its parent');
            $table->foreignId('request_id')->comment('Which request this is attached to');
            $table->foreignId('user_id')->comment('Who is this activity attached to');
            $table->foreignId('activity_reason_id')->nullable()->comment('ID of related activity reason (if any)');
            $table->foreignId('activity_type_id')->nullable();
            $table->string('message')->nullable()->comment('Could be activity type or formatted message');
            $table->json('json_message')->nullable()->comment('Data needed for the notifications');
            $table->boolean('priority')->default(0);
            $table->boolean('notify_admin')->default(0)->comment('Will be deprecated');
            $table->boolean('notify_healthplan')->default(0)->comment('Will be deprecated');
            $table->boolean('notify_reviewer')->default(0)->comment('Will be deprecated');
            $table->boolean('notify_therapist')->default(0)->comment('Will be deprecated');
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
        Schema::dropIfExists('activities');
    }
}
