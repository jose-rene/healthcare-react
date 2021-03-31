<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');

            $table->unsignedBigInteger('request_id');
            $table->unsignedBigInteger('request_type_id');
            $table->unsignedBigInteger('request_outcome_id')->nullable();
            $table->string('hcpcs')->nullable();
            $table->string('note')->nullable();
            $table->string('clinician_summary')->nullable();
            $table->string('assessment')->nullable();
            $table->string('decision')->nullable();
            $table->json('json_data')->nullable();
            $table->boolean('additional_consideration')->nullable();

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
        Schema::dropIfExists('request_items');
    }
}
