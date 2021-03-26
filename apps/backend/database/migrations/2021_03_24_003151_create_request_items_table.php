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

            $table->unsignedBigInteger('request_id');
            $table->unsignedBigInteger('request_type_id');
            $table->unsignedBigInteger('request_outcome_id');
            $table->string('hcpcs');
            $table->string('note');
            $table->string('clinician_summary');
            $table->string('assessment');
            $table->string('decision');
            $table->json('json_data');
            $table->boolean('additional_consideration');

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
