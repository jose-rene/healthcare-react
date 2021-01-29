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
            $table->foreign('parent_id')->references('id')->on('activities')->onDelete('set null');
            $table->foreignId('request_id');
            $table->foreignId('user_id');
            $table->foreignId('activity_type_id');
            $table->string('message');
            $table->boolean('notify_admin')->default(0);
            $table->boolean('notify_healthplan')->default(0);
            $table->boolean('notify_reviewer')->default(0);
            $table->boolean('notify_therapist')->default(0);
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
